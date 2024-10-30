import PusherServer from "pusher";
import PusherClient from "pusher-js";
export const pusherServer = new PusherServer({
  appId: "1888469",
  key: "fa8fbfbaa416ebc39b49",
  secret: "d0356fcf77c337efd88e",
  cluster: "sa1",
  useTLS: true,
});

export const pusherClient = new PusherClient("fa8fbfbaa416ebc39b49", {
  cluster: "sa1",
});
