import React from "react";
import { NextPageContext } from "next";

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </h1>
      <p>Please refresh the page or try again later.</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

