import React from "react";

const AlgoliaContext = React.createContext();

export const AlgoliaProvider = AlgoliaContext.Provider;
export const AlgoliaConsumer = AlgoliaContext.Consumer;

export default AlgoliaContext;
