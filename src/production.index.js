import './style.css';
import './post.css';

import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { 
  faTwitter,
  faFacebook,
  faLine,
  faAdobe,
  faVuejs,
  faJs,
  faSass,
  faCss3,
  faHtml5,
  faWordpress,
  faPhp,
  faDrupal,
  faMagento,
  faLaravel,
  faGithub,
  faGitlab,
  faDocker,
  faMailchimp,
  faSlack,
  faSourcetree,
  faTrello,
  faYoutube
} from '@fortawesome/free-brands-svg-icons'
library.add(
  faTwitter,
  faFacebook,
  faLine,
  faAdobe,
  faVuejs,
  faJs,
  faSass,
  faCss3,
  faHtml5,
  faWordpress,
  faPhp,
  faDrupal,
  faMagento,
  faLaravel,
  faGithub,
  faGitlab,
  faDocker,
  faMailchimp,
  faSlack,
  faSourcetree,
  faTrello,
  faYoutube
)
dom.i2svg();

if(document.body.classList[0] !== 'single-post') {
  const icon = document.head.querySelector('link[ref="custom-icon"]');
  icon.disabled = false;
}

// import 'prismjs';

// import SearchList from './assets/script/search-list';
// new SearchList();
// import IndexList from './assets/script/index-list';
// new IndexList();
// import PostList from './assets/script/post-list';
// new PostList();

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//     .register("/sw.js")
//     .then(registration => {
//       console.log("SW registered: ", registration);
//     })
//     .catch(registrationError => {
//       console.log("SW registration failed: ", registrationError);
//     });
//   });
// }
