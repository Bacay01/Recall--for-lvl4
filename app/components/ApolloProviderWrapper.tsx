"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "../../lib/apolloClient";

const ApolloProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;