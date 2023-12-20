import { lazy } from "react";
import ViewLeagueTour from "../pages/league/tournaments/ViewLeagueTour";
const ViewRoundLobby = lazy(() =>
  import("../pages/league/tournaments/ViewRoundLobby")
);
const Games = lazy(() => import("../pages/games"));
const Teams = lazy(() => import("../pages/teams"));
const Users = lazy(() => import("../pages/users/"));
const View = lazy(() => import("../pages/users/View"));
const Setting = lazy(() => import("../pages/setting"));
const Support = lazy(() => import("../pages/support"));
const Sponsor = lazy(() => import("../pages/sponsor"));
const Request = lazy(() => import("../pages/request"));
const Login = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const Stages = lazy(() => import("../pages/league/stages"));
const GameTypes = lazy(() => import("../pages/games/types"));
const Tournaments = lazy(() => import("../pages/tournament"));
const ViewGame = lazy(() => import("../pages/games/ViewGame"));
const Transaction = lazy(() => import("../pages/transaction"));
const Profile = lazy(() => import("../pages/setting/profile"));
const Notification = lazy(() => import("../pages/notification"));
const ViewTour = lazy(() => import("../pages/tournament/ViewTour"));
const TDMPlayers = lazy(() => import("../pages/TDMPlayers/index"));
const GamePlayers = lazy(() => import("../pages/gamePlayers/index"));
const LeagueTournaments = lazy(() => import("../pages/league/tournaments"));
const TdmPlayersDetails = lazy(() =>
  import("../pages/TDMPlayers/TdmPlayersDetails")
);
const BetAmount = lazy(() => import("../pages/TDMPlayers/BetAmount"));
const SavedTeam = lazy(() => import("../pages/savedTeam/index"));
const GamePlayersDetails = lazy(() =>
  import("../pages/gamePlayers/GamePlayerDetails")
);

const AllRoutes = [
  {
    name: "Login",
    path: "/",
    element: <Login />,
    private: false,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    element: <Dashboard />,
    private: true,
  },
  {
    name: "Games",
    path: "/games",
    element: <Games />,
    private: true,
  },

  {
    name: "Game Types",
    path: "/game-types",
    element: <GameTypes />,
    private: true,
  },

  {
    name: "View Games",
    path: "/games/:slug",
    element: <ViewGame />,
    private: true,
  },

  {
    name: "View Tour",
    path: "/tournaments/:slug",
    element: <ViewTour />,
    private: true,
  },

  {
    name: "Tournaments",
    path: "/Tournaments",
    element: <Tournaments />,
    private: true,
  },

  {
    name: "League Stages",
    path: "/league/stages",
    element: <Stages />,
    private: true,
  },
  {
    name: "League Tournaments",
    path: "/league/tournaments",
    element: <LeagueTournaments />,
    private: true,
  },
  {
    name: "View League Tournaments",
    path: "/league/tournaments/:slug",
    element: <ViewLeagueTour />,
    private: true,
  },
  {
    name: "View League Tournaments Round Lobby",
    path: "/league/tournaments/:slug/:slug",
    element: <ViewRoundLobby />,
    private: true,
  },
  {
    name: "Users",
    path: "/users",
    element: <Users />,
    private: true,
  },
  {
    name: "User Profile",
    path: "/user-profile",
    element: <View />,
    private: true,
  },

  {
    name: "Teams",
    path: "/:user_id/teams",
    element: <Teams />,
    private: true,
  },
  {
    name: "TDM Challenges",
    path: "tdmPlayers",
    element: <TDMPlayers />,
    private: true,
  },
  {
    name: "View Games",
    path: "/tdm-player-details/:slug",
    element: <TdmPlayersDetails />,
    private: true,
  },
  {
    name: "GamePlayers",
    path: "/:user_id/gamePlayers",
    element: <GamePlayers />,
    private: true,
  },
  {
    name: "View Games",
    path: "/game-players-details/:slug",
    element: <GamePlayersDetails />,
    private: true,
  },
  // BetAmount
  {
    name: "Bet Amount",
    path: "/bet-amount",
    element: <BetAmount />,
    private: true,
  },
  {
    name: "Saved Team",
    path: "/saved-team",
    element: <SavedTeam />,
    private: true,
  },
  {
    name: "Transaction",
    path: "/transactions",
    element: <Transaction />,
    private: true,
  },
  {
    name: "Support",
    path: "/support",
    element: <Support />,
    private: true,
  },
  {
    name: "Sponsor",
    path: "/sponsor",
    element: <Sponsor />,
    private: true,
  },
  {
    name: "Setting",
    path: "/setting",
    element: <Setting />,
    private: true,
  },
  {
    name: "Notifications",
    path: "/notification",
    element: <Notification />,
    private: true,
  },
  {
    name: "Withdraw requests",
    path: "/withdraw-requets",
    element: <Request />,
    private: true,
  },
  {
    name: "Notifications",
    path: "/notification",
    element: <Notification />,
    private: true,
  },

  {
    name: "Profile",
    path: "/setting/profile",
    element: <Profile />,
    private: true,
  },
];

export default AllRoutes;
