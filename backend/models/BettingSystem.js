const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Paste one or more documents here
 */
// {
//   "id": 2,
//   "title": "The Zero Shots On Target @ 15Min System 🤑",
//   "description": "This is a very very special system. Very high odds and simple to follow. You do not even have to wait till the end of the match for profit. We will be using the power of data available to Footy Amigo to beat the bookies in their own game. The system is called \"The Zero Shots On Target @15Mins Profit System\" for a reason. ",
//   "roi": 500,
//   "video_embed": "<div style=\"padding:56.25% 0 0 0;position:relative;\"><iframe src=\"https://player.vimeo.com/video/650221001?h=37a894417d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"position:absolute;top:0;left:0;width:100%;height:100%;\" title=\"Footy Amigo Final HD.mp4\"></iframe></div><script src=\"https://player.vimeo.com/api/player.js\"></script>",
//   "video_description": "This system follows placing an over 0.5 first half goal bet at the 15min of a match where there are ZERO shots on target and ZERO goals. What makes this system have such a high strike rate is the PreMatch stats added to it. Watch the video and see how it works. ",
//   "learn": "You will be learning and seeing a very simple but profitable 1st half goal system. This is where the power of data and Footy Amigo comes to the rescue.  (Disclaimer: Results are not typical. Before placing any bet with any system provided by us, spend som",
//   "active": 0,
//   "created_at": "2021-10-29T01:43:15.000Z",
//   "updated_at": "2022-01-17T07:30:16.000Z",
//   "preset_ids": [1095]
// }

const BettingSystemSchema = new Schema(
  {
    id: { type: Number },
    title: { type: String, required: true },
    description: { type: String, required: true },
    roi: { type: Number, required: true },
    video_embed: { type: String, required: true },
    video_description: { type: String, required: true },
    learn: { type: String, required: true },
    active: { type: Boolean, required: true, default: false },
    preset_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "Strategy",
      },
    ],
    presets: [Object],
  },
  {
    strict: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
const BettingSystem = mongoose.model("BettingSystem", BettingSystemSchema);
const Strategy = require("./Strategy");
// BettingSystem.deleteMany({}).then((x) => (c = x));

BettingSystem.findActive = function () {
  return this.find({ active: true });
};
BettingSystem.findActiveById = function (id) {
  return this.findOne({ _id: id, active: true }, { preset_ids: 0 });
};

BettingSystem.toggleByAdmin = function (id) {
  return this.findByIdAndUpdate(id, [
    { $set: { active: { $eq: [false, "$active"] } } },
  ]);
};

BettingSystem.createByAdmin = async function (body) {
  const {
    title,
    description,
    roi,
    video_embed,
    video_description,
    learn,
    active,
    preset_ids,
  } = body;
  const session = await this.startSession();
  return await session.withTransaction(async () => {
    const betting_system = await BettingSystem.create({
      title,
      description,
      roi,
      video_embed,
      video_description,
      learn,
      preset_ids,
      active,
    });
    await betting_system.populate("preset_ids", "title hit_rate");
    betting_system.presets = betting_system.toObject().preset_ids;
    console.log(betting_system.toObject().preset_ids, "HEHHHEHE");
    betting_system.preset_ids = preset_ids;
    await betting_system.save();
    return betting_system;
  });
};

BettingSystem.updateByAdmin = async function (body) {
  const {
    _id,
    title,
    description,
    roi,
    video_embed,
    video_description,
    learn,
    active,
    preset_ids,
  } = body;
  const session = await this.startSession();
  return await session.withTransaction(async () => {
    const betting_system = await BettingSystem.findByIdAndUpdate(
      _id,
      {
        title,
        description,
        roi,
        video_embed,
        video_description,
        learn,
        active,
        preset_ids,
      },
      { new: true }
    );
    await betting_system.populate("preset_ids", "title hit_rate");
    betting_system.presets = betting_system.toObject().preset_ids;
    betting_system.preset_ids = preset_ids;
    await betting_system.save();
    return betting_system;
  });
};

const systems = [
  {
    id: 2,
    title: "The Zero Shots On Target @ 15Min System 🤑",
    description:
      'This is a very very special system. Very high odds and simple to follow. You do not even have to wait till the end of the match for profit. We will be using the power of data available to Footy Amigo to beat the bookies in their own game. The system is called "The Zero Shots On Target @15Mins Profit System" for a reason. ',
    roi: 500,
    video_embed:
      '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/650221001?h=37a894417d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Footy Amigo Final HD.mp4"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
    video_description:
      "This system follows placing an over 0.5 first half goal bet at the 15min of a match where there are ZERO shots on target and ZERO goals. What makes this system have such a high strike rate is the PreMatch stats added to it. Watch the video and see how it works. ",
    learn:
      "You will be learning and seeing a very simple but profitable 1st half goal system. This is where the power of data and Footy Amigo comes to the rescue.  (Disclaimer: Results are not typical. Before placing any bet with any system provided by us, spend som",
    active: false,
    created_at: "2021-10-29T01:43:15.000Z",
    updated_at: "2022-01-17T07:30:16.000Z",
    preset_ids: [1095],
  },
  {
    id: 5,
    title: "Over 1.5 Goals at 2.0 Odds System 🔥",
    description:
      "Using the power of Footy Amigo, you will learn and see how to find profitable Over 1.5 goals fixtures to bet on at odds 1.65 - 2.0. For this sytem, we will be playing it very smart by leveraging the same technology the bookies use to gain edge, against them. You will see how to place your bets at a specific time of a match.  The hard work has been done for you. Follow this system, and see the power of it.",
    roi: 200,
    video_embed:
      '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/646658965?h=5401ae641c&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="over 1.5 goals system.mp4"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
    video_description:
      "This system involves placing your bets at the 30th minute of a live match with a current score line of 0-0. But that's not all, You will be combining the power of InPlay alerts with PreMatch historical stats and data for added leverage and confidence, all this is explained indepth in the video. ",
    learn:
      "You will be learning a simple, yet profitable betting system for placing Over 1.5 Goals Bets with odds ranging from 1.65, 1.7, 1.8 up to 2.0. Watch the video to know more.  (Disclaimer: Results are not typical. Before placing any bet with any system provi",
    active: true,
    created_at: "2021-10-29T04:24:06.000Z",
    updated_at: "2021-11-27T05:54:34.000Z",
    preset_ids: [1583],
  },
  {
    id: 6,
    title: "1 More Goal To Be Scored System ⚽",
    description:
      'Just as the name implies - the "1 more goal to be scored sytem" is a very interesting betting system where you will be placing bets that 1 more goal will be scored in the 2nd half of a Match. Using the accompanied strategy presets attached to this system, you will be able to be alerted on matches and games that fits these criterias.',
    roi: 100,
    video_embed:
      '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/646641673?h=78ff5675de&badge=0&autopause=0&player_id=0&app_id=58479/embed" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen frameborder="0" style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div>',
    video_description:
      "This system involves placing your bet at Half Time of a live match where the score line is 1-1 or 2-2. The idea behind this system is that - given certain conditions (such as shots on target, goals scored, PreMatch Stats, etc) if both teams are on a scorelines 1-1 and sometimes 2-2, they will be pushing for more goals in the second half. ",
    learn:
      "You will be learning a simple, yet profitable betting system for placing bets on 1 more goal to be scored in 2nd half at odds 1.5, 1.7 or even 2.0. Watch the video to know more.  (Disclaimer: Results are not typical. Before placing any bet with any system",
    active: true,
    created_at: "2021-10-29T04:40:57.000Z",
    updated_at: "2021-11-27T05:54:44.000Z",
    preset_ids: [100, 101],
  },
  {
    id: 7,
    title: "The Late Cheeky Corner System 😱",
    description:
      "In this system, we will be focusing on corners, specifically the total corners of a match but with a twist! We will look at the Live and Prematch Stats that must be met for us to find and bet on profitable games at Odds 1.7, 1.8, 2.0 or more! We will be alerted at the 20th minute of a match with a specific amount of corners and then be able to place an intelligent bet. ",
    roi: 250,
    video_embed:
      '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/640300645?h=37a894417d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Footy Amigo Final HD.mp4"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
    video_description:
      'This system involves placing your Over 7.5 or 8.5 Corner bets at the 20th minute in a live match where there has been only 1 corners at the 20th minute of the match. The reasoning is that - At the 20th minute of a match with 1 corner, the odds for Over 6.5, 7.5, 8.5 and the rest will be much more profitable and higher because the bookies "think" their occurrence is low. ',
    learn:
      "You will be learning an exciting corner betting strategy for betting the Over 7.5 or 8.5 corner markets profitably. Watch the video to know more. ",
    active: false,
    created_at: "2021-10-29T04:57:19.000Z",
    updated_at: "2021-11-17T09:48:40.000Z",
    preset_ids: [],
  },
  {
    id: 8,
    title: "Over 0.5 Goals 1st Half System 🐐",
    description:
      "This is one of our favorite betting systems because it combines a lot of interesting rules and conditions that must be met for a game to qualify to be bet on with this system. We will be using strictly PreMatch stats to filter matches that fits this system and are worthy of an Over 0.5 1st Half Goal bet. The is an ever improving system and it will keep getting better as time goes on.  ",
    roi: 120,
    video_embed:
      '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/646856101?h=9e6d199cd1&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="0.5 1h goal betting system.mp4"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
    video_description:
      "This system involves placing an Over 0.5 1st Goal bet before a match starts. There are some rules and conditions that must be met and this is explained in the video. Watch video for full explanation.  ",
    learn:
      "You will be learning an interesting Over 0.5 Goal Bet System that you can use to make quick profits on prematch matches. Watch the video to know more. ",
    active: true,
    created_at: "2021-10-29T05:57:22.000Z",
    updated_at: "2021-11-22T13:18:12.000Z",
    preset_ids: [43],
  },
  {
    id: 9,
    title: "New Mind-blowing Away Win System 🚀",
    description:
      "In this system, you will see just how powerful Footy Amigo is to spit out high quality Away Win games ON A DAILY BASIS. We will also show you backtesting results of this strategy to see how it has performed in the past incredibily. Footy Amigo has done it again, another profitabl PreMatch system delivered!",
    roi: 300,
    video_embed:
      '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/666751558?h=37a894417d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Footy Amigo Final HD.mp4"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
    video_description:
      "This system involves placing your bets Pre-Match before a game starts. The video above shows examples the rules and strategy behind this Away Win betting system. Enjoy",
    learn:
      "You will be learning a very interesting Away Win strategy for PreMatch betting. ",
    active: false,
    created_at: "2021-10-29T06:09:28.000Z",
    updated_at: "2022-01-17T07:37:46.000Z",
    preset_ids: [41, 42, 11134],
  },
  {
    id: 12,
    title: "The 70th Minute Profit System 🐐",
    description:
      "This is one of our favorite betting systems because of its simplicity, attention to detail and high success rate. We will be using both live InPlay alert and PreMatch stats to filter matches that fits this system, you will love this one. The odds for this strategy is always around 2.1, 2.0, 1.8, 1.6, etc. The is an ever improving system and it will keep getting better as time goes on.  ",
    roi: 200,
    video_embed:
      '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/645787049?h=66d6a07353&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="70th Minute System.mp4"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
    video_description:
      "This system involves placing your bet at the 70th minute of a match. In the video above, I explain and show you the rules and conditions that must be met before placing your bets. Don't worry, Footy Amigo does all the heavy lifting for you. Watch video for full explanation.  ",
    learn:
      "You will be learning an interesting Under 2.5 Goals Bet System that you can use to make quick profits on live matches. Watch the video to know more.  (Disclaimer: Results are not typical. Before placing any bet with any system provided by us, spend some d",
    active: false,
    created_at: "2021-11-14T11:55:18.000Z",
    updated_at: "2022-01-22T07:08:19.000Z",
    preset_ids: [74],
  },
  {
    id: 13,
    title: "The Over 2.5 Goals System with High Odds 🚀",
    description:
      "In this system, you will see just how powerful Footy Amigo is to spit out high quality Over 2.5 goals games ON A DAILY BASIS. We will also show you an example of real life bets being placed from the alerts sent by this system. Footy Amigo has done it again, another profitabl PreMatch system delivered!",
    roi: 300,
    video_embed:
      '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/650352288?h=37a894417d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Footy Amigo Final HD.mp4"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
    video_description:
      "This system involves placing your bets Pre-Match before a game starts. The video above shows examples the rules and strategy behind this Over 2.5 goals system. Enjoy",
    learn:
      "You will be learning a very interesting Over 2.5 goals strategy for PreMatch betting.  (Disclaimer: Results are not typical. Before placing any bet with any system provided by us, spend some days to test the system with no money to see how it performs, an",
    active: true,
    created_at: "2021-11-26T10:11:03.000Z",
    updated_at: "2021-11-27T06:01:26.000Z",
    preset_ids: [1688, 5505],
  },
  {
    id: 14,
    title: "Under 1.5 1H Goal High Odds System ⚡",
    description:
      "For this system, we are using the Bookie's algorithim against them with the power of Footy Amigo on-time alerts. This system involves placing an under 1.5 1H Goals bet at a particular time in a match (with odds ranging from 2.0 up to 2.5 and a high strike rate). An amazing system to add to your arsenal",
    roi: 100,
    video_embed:
      '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/653360919?h=37a894417d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Footy Amigo Final HD.mp4"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
    video_description:
      "This system involves placing an Under 1.5 First Half Goals Bet at the 20th Minute of a live match. We will be making use of InPlay Alerts + PreMatch stats to turn the table against the bookie. Watch the video to see how the system works. ",
    learn:
      "You will be learning a new system where an Under 1.5 Goals bets will be placed at the 20th min of a live match.",
    active: true,
    created_at: "2021-12-05T04:56:23.000Z",
    updated_at: "2021-12-05T04:56:37.000Z",
    preset_ids: [2739],
  },
  {
    id: 15,
    title: "Over 90% Away Win System 🚀",
    description:
      "In this system, you will see just how powerful Footy Amigo is to spit out high quality Away Win games ON A DAILY BASIS. We will also show you backtesting results of this strategy to see how it has performed in the past incredibily. Footy Amigo has done it again, another profitabl PreMatch system delivered! ",
    roi: 300,
    video_embed:
      '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/666751558?h=37a894417d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Footy Amigo Final HD.mp4"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
    video_description:
      "This system involves placing your bets Pre-Match before a game starts. The video above shows examples the rules and strategy behind this Away Win betting system. (PS: Recomended markets are Away Win, Over 1.5, BTTS and other markets you deem right after your personal backtesting)",
    learn:
      "You will be learning a very interesting Away Win strategy for PreMatch betting. ",
    active: true,
    created_at: "2022-01-17T07:39:57.000Z",
    updated_at: "2022-01-20T10:40:16.000Z",
    preset_ids: [11134],
  },
];

// BettingSystem.deleteMany({}).then((x) => x);
// systems.forEach(async (system) => {
//   const strategies = await Strategy.find(
//     { id: { $in: system.preset_ids } },
//     { _id: 1 }
//   ).lean();
//   console.log(strategies, "FOUND");
//   system.preset_ids = strategies.map((x) => x._id);
//   await BettingSystem.createByAdmin(system);
// });
module.exports = BettingSystem;
