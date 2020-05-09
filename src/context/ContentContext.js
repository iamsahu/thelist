import React,{useState} from 'react'

const ContentContext = React.createContext()

export const ContentProvider = ContentContext.Provider
export const ContentConsumer = ContentContext.Consumer

export const MusicPlayerProvider = (props) => {
    const [state, setState] = useState({});
    return (
      <ContentContext.Provider value={[state, setState]}>
        {props.children}
      </ContentContext.Provider>
    );
  }

export default ContentContext