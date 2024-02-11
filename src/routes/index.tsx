import ForumIndex from "@/pages/Forum";
import SortIndex from "@/pages/Sort";
import MeetRoom from "@/pages/MeetRoom";
import Baby from "@/pages/Baby";
import Study from "@/pages/Study";

const routes = [
  {
    path: "/sort",
    element: <SortIndex />,
  },
  {
    path: "/forum",
    element: <ForumIndex />,
  },
  {
    path: "/meetRoom",
    element: <MeetRoom />,
  },
  {
    path: "/baby",
    element: <Baby />,
  },
  {
    path: "/study",
    element: <Study />,
  },
];

export default routes;
