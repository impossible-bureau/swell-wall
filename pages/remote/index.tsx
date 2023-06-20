// import { SocketSiteContext } from 'contexts/socket-site';
import { gsap } from 'gsap';
import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { io } from 'socket.io-client';
// import { useAnimationFrame } from 'framer-motion';
import _ from 'lodash';
import { uid } from 'uid';
// import fonts from 'styles/fonts';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-overflow-scrolling: touch;
`;

const Pad = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #222222;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-overflow-scrolling: touch;
  cursor: pointer;
  user-select: none;
`;

const socketUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://jeff.local:3001';

const RemotePage = () => {
  const socket = useRef(io(socketUrl));
  const padRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef<number>();
  const scrollVelocity = useRef(0);
  const isTouchDown = useRef(false);
  const idRef = useRef(uid(6));
  const id = idRef.current;

  const onTouchStart = useCallback<any>((event: TouchEvent) => {
    if (event?.touches?.length) {
      const { touches } = event;
      const { clientY } = touches[0];
      lastScrollY.current = clientY;
    }

    if (padRef.current)
      gsap.to(padRef.current, {
        backgroundColor: '#333333',
        duration: 0.1,
      });

    // socket.current.emit('pad-down', true);
    isTouchDown.current = true;
  }, []);

  const onTouchEnd = useCallback<any>(() => {
    if (padRef.current)
      gsap.to(padRef.current, {
        backgroundColor: '#222222',
        duration: 0.1,
      });

    isTouchDown.current = false;
  }, []);

  const onTouchMove = useCallback<any>((event: TouchEvent) => {
    const { touches } = event;
    const { clientX, clientY } = touches[0];
    const x = clientX / global?.window?.innerWidth;
    const y = clientY / global?.window?.innerHeight;
    const params = JSON.stringify({ id, x, y });
    socket.current.emit('touch-move', params);
  }, []);

  useEffect(() => {
    socket.current.emit('remote-join-room', 'swell-wall');

    const html = document.getElementsByTagName('html')[0]; // '0' to assign the first (and only `HTML` tag)
    if (!_.includes(html.className, ' remote')) html.className += ' remote';

    const body = document.getElementsByTagName('html')[0]; // '0' to assign the first (and only `HTML` tag)
    if (!_.includes(body.className, ' remote')) body.className += ' remote';

    return () => {
      body.className = body.className.split(' remote').join('');
      html.className = html.className.split(' remote').join('');
    };
  }, []);

  return (
    <Container>
      <Pad
        ref={padRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        onMouseDown={onTouchStart}
        onMouseUp={onTouchEnd}
      ></Pad>
    </Container>
  );
};

export default RemotePage;
