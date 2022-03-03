class MainElement {

}


class LeaderBoard {
  constructor(game){
    this.game = game;
  }

  setHandlers(){
    game.on("fail", async ({ game }) => {
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

      fetch(`https://stats-co.zoodogood.repl.co/let-s-bet/score/>100?method=increment`, options);
    })

    game.on("victory", async ({ game, score }) => {
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

      fetch(`https://stats-co.zoodogood.repl.co/let-s-bet/score/=${ score }?method=increment`, options)
        .catch(err => console.log(err));
    })
  }
}


new LeaderBoard(globalThis.game);
