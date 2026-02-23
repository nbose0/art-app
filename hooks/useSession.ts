"use client";

import { useCallback, useRef } from "react";
import usePartySocket from "partysocket/react";
import { useAppStore } from "@/stores/appStore";
import type { HostAction, ServerMessage } from "@/lib/partyMessages";

const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST ?? "localhost:1999";

export function useSession(roomId: string | null) {
  const {
    syncState,
    setTimerSecondsLeft,
    setIsHost,
    setIsConnected,
    setSessionCode,
    setParticipantCount,
    setArtworks,
  } = useAppStore();

  const isHostRef = useRef(false);

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: roomId ?? "__placeholder__",
    startClosed: !roomId,

    onOpen() {
      setIsConnected(true);
    },

    onClose() {
      setIsConnected(false);
    },

    onMessage(event: MessageEvent) {
      try {
        const msg: ServerMessage = JSON.parse(event.data as string);
        switch (msg.type) {
          case "state-sync":
            syncState(msg.state);
            break;
          case "timer-tick":
            setTimerSecondsLeft(msg.secondsLeft);
            break;
          case "phase-change":
            syncState({ phase: msg.phase } as never);
            break;
          case "round-update":
            useAppStore.setState({
              currentRound: msg.round,
              roundState: msg.roundState,
              timerSecondsLeft: msg.timerSecondsLeft,
              timerTotalSeconds: msg.timerTotalSeconds,
              timerRunning: true,
            });
            break;
          case "artworks-selected":
            setArtworks(msg.selected, msg.all);
            useAppStore.setState({ phase: "slot-machine" });
            break;
          case "participant-count":
            setParticipantCount(msg.count);
            break;
          case "role-assigned":
            isHostRef.current = msg.isHost;
            setIsHost(msg.isHost);
            setSessionCode(msg.sessionCode);
            break;
          case "error":
            console.error("Server error:", msg.message);
            break;
        }
      } catch (err) {
        console.error("Failed to parse server message:", err);
      }
    },
  });

  const sendAction = useCallback(
    (action: HostAction) => {
      if (socket && isHostRef.current) {
        socket.send(JSON.stringify(action));
      }
    },
    [socket]
  );

  return { socket, sendAction };
}
