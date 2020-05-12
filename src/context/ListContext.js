import React from 'react'

const ContentContext = React.createContext()

export const ContentProvider = ContentContext.Provider
export const ContentConsumer = ContentContext.Consumer

export default ContentContext