import ForumIndex from "@/pages/Forum";
import SortIndex from "@/pages/Sort";
import MeetRoom from "@/pages/MeetRoom";
import Baby from "@/pages/Baby";

const routes = [
  {
    path: "/",
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
];

export default routes;
