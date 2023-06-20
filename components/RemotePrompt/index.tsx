import { useContext, useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import styled from 'styled-components';
import { gsap, Power3 } from 'gsap';
import { useAnimationFrame, useScroll } from 'framer-motion';
import Point from 'lib/Point';
// import { SocketSiteContext } from 'contexts/socket-site';
import fonts from 'styles/fonts';

const Qr = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;

  width: 100%;
  /* border: 2px solid red; */

  display: flex;
  align-items: center;
  justify-content: center;
  /* z-index: 99999; */

  @media (max-width: 640px) {
    display: none;
  }

  background: black;
`;

const QrBox = styled.div`
  position: relative;
  /* padding: 10px; */
  overflow: hidden;
  width: 438px;
  height: 100px;
  /* border-radius: 20px; */
  display: flex;
`;

const Padding = styled.div`
  position: relative;
  padding: 10px;
  display: flex;
  background: white;
`;

const QrMessage = styled.div`
  position: absolute;
  left: 114px;
  top: 22px;
  color: black;
  width: 600px;

  h3 {
    font-family: ${fonts.halfFat};
    font-size: 34px;
    color: white;
    line-height: 30px;
  }

  h4 {
    font-family: ${fonts.light};
    font-size: 20px;
    margin-left: 1px;
    color: #dddddd;
  }
`;

const RemotePrompt = () => {
  // const { socketId } = useContext(SocketSiteContext);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrMaskRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const [qrLink, setQrLink] = useState<string | boolean>(false);

  useEffect(() => {
    // console.log('socketId:', socketId);
    const baseUrl = global?.window?.location?.href;
    setQrLink(`${baseUrl}remote`);
  }, []);

  const { scrollY } = useScroll();

  // useAnimationFrame(() => {
  //   const wh = global?.window?.innerHeight || 100;
  //   const sy = scrollY.get();
  //   const openProgress = Power3.easeOut(Point.remap(sy, wh * 2, wh * 3, 0, 1));
  //   const closeProgress = Power3.easeIn(Point.remap(sy, wh * 5, wh * 6, 0, 1));

  //   gsap.set(qrRef.current, {
  //     y: 110 - (openProgress - closeProgress) * 110,
  //   });
  //   gsap.set(messageRef.current, {
  //     x: -500 + (openProgress - closeProgress) * 500,
  //   });
  // });

  const renderCode = () => {
    return (
      <Qr ref={qrRef}>
        <QrBox ref={qrMaskRef}>
          <QrMessage ref={messageRef}>
            <h3>RemotelyPossible™</h3>
            <h4>BETA</h4>
          </QrMessage>
          <Padding>
            <QRCodeSVG size={80} value={qrLink as string} level="L" />
          </Padding>
        </QrBox>
      </Qr>
    );
  };

  return qrLink ? renderCode() : <></>;
};

export default RemotePrompt;
