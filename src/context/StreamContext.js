import React from "react";

const StreamContext = React.createContext();

export const StreamProvider = StreamContext.Provider;
export const StreamConsumer = StreamContext.Consumer;

export default StreamContext;
