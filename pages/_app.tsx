import React from "react";
import { AppProps } from "next/app";
import { polyfill } from "seamless-scroll-polyfill";
import "../styles/globals.scss";
import Footer from "../components/footer";

function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    polyfill();
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default App;
