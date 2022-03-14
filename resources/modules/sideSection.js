
class LeaderBoard {
  constructor(game){
    this.game = game;
    this.#setHandlers();
    this.#takeVisit();
  }

  #setHandlers(){
    this.game.events.on("starts", () => this.startsTimestamp = Date.now());

    this.game.events.on("fail", async ({ game }) => {
      const options = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "text/plain"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      }

      fetch(`https://stats-co.zoodogood.repl.co/let-s-bet/score/BIG_100?method=increment`, options);

      const userScore = JSON.parse(localStorage["score"] ?? "{}");
      userScore["BIG_100"] = (userScore["BIG_100"] ?? 0) + 1;
      localStorage["score"] = JSON.stringify(userScore);

      this.#takeSpendTime();
    })

    this.game.events.on("victory", async ({ game, score }) => {
      const options = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "text/plain"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      }

      fetch(`https://stats-co.zoodogood.repl.co/let-s-bet/score/EQUAL_${ score }?method=increment`, options);

      const userScore = JSON.parse(localStorage["score"] ?? "{}");
      userScore[`EQUAL_${ score }`] = (userScore[`EQUAL_${ score }`] ?? 0) + 1;
      localStorage["score"] = JSON.stringify(userScore);

      this.#takeSpendTime();
    })

  }

  async #takeVisit(){
    const options = {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "text/plain"
      },
      redirect: "follow",
      referrerPolicy: "no-referrer"
    }

    if (!("visits" in localStorage))
      await fetch(`https://stats-co.zoodogood.repl.co/let-s-bet/uniqueUser?method=increment`, options);


    await fetch(`https://stats-co.zoodogood.repl.co/let-s-bet/visits?method=increment`, options);
    localStorage["visits"] = +(localStorage["visits"] ?? 0) + 1;
  }

  #takeSpendTime(){
    const slice = Date.now() - this.startsTimestamp;

    const options = {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "text/plain"
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: slice
    }

    await fetch(`https://stats-co.zoodogood.repl.co/let-s-bet/spendTime?method=increment`, options);
    await fetch(`https://stats-co.zoodogood.repl.co/let-s-bet/recordTimeEnd?method=minimal`, options);

    localStorage["spendTime"] = +(localStorage["spendTime"] ?? 0) + slice;
    localStorage["recordTimeEnd"] = Math.min(+(localStorage["recordTimeEnd"] ?? Infinity), slice);
  }
}

new LeaderBoard( globalThis.game );
