import mixpanel from 'mixpanel-browser';
// import { useContext } from 'react';
// import { UserContext } from './components/common/page';
// //import { useAuth0 } from './lib/react-auth0-spa';

// //const { user} = useAuth0();
// const { user } = useContext(UserContext);

mixpanel.init('4521493075a15cf75d66df3581c5410e');
// for development use daaaa7a40d3cbf29902541523101ed22  
//mixpanel.identify(user.sub);
//  mixpanel.people.set({
//    "$email": user.email,    // only reserved properties need the $
//    "$name": user.nickname,
//    });

let env_check = process.env.NODE_ENV === 'production';

let actions = {
  identify: (id) => {
    
    mixpanel.identify(id);
  },
  alias: (id) => {
    
    mixpanel.alias(id);
  },
  track: (name, props) => {
    
    mixpanel.track(name, props);
  },
  register: (props) => {
    
    mixpanel.register(props);
  },
  people: {
    set: (props) => {
      
      mixpanel.people.set(props);
    },
  },
};
let Mixpanel = actions;

export default Mixpanel
