import { gsap } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { uid } from 'uid';
import isMobile from 'ismobilejs';
import _ from 'lodash';

export const SocketSiteContext = React.createContext({
  // pad: {
  //   current: {
  //     x: 0,
  //     y: 0,
  //   },
  // },
  // padDown: null,
  // setPadDown: null,
  // socketId: null,
  // padColor: null,
  // setPadColor: null,
  // onTouchDown: null,
  // onTouchUp: null,
});

export interface SocketSiteProviderProps {
  children: React.ReactNode;
}

const socketUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://jeff.local:3001';

const SocketSiteProvider = ({ children }: SocketSiteProviderProps) => {
  const [padDown, setPadDown] = useState(false);
  const [padColor, setPadColor] = useState('#000000');
  const socketIdRef = useRef(uid(6));

  const socket = useRef<Socket | null>(null);
  const pad = useRef({
    x: 0,
    y: 0,
  });

  const contextValue = {
    pad,
    padDown,
    setPadDown,
    socketId: socketIdRef.current,
    padColor,
    setPadColor,
  };

  // on start
  useEffect(() => {
    if (isMobile().any) return;
    socket.current = io(socketUrl);
    socket.current.emit('site-join-room', socketIdRef.current);
  }, []);

  useEffect(() => {
    if (isMobile().any || _.isNull(socket.current)) return;

    socket.current.on('server-pad-color', arg => {
      setPadColor(arg);
    });

    socket.current.on('server-pad-down', arg => {
      setPadDown(arg);
    });

    socket.current.on('server-pad-scroll', arg => {
      const doc = document.documentElement;
      const top = (window.scrollY || doc.scrollTop) - (doc.clientTop || 0);
      gsap.to(window, {
        scrollTo: {
          x: 0,
          y: top + arg * 10,
        },
      });
    });
  }, [padDown, setPadDown]);

  return (
    <SocketSiteContext.Provider value={contextValue}>
      {children}
    </SocketSiteContext.Provider>
  );
};

export default SocketSiteProvider;
