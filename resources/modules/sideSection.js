class MainElement {

}


class LeaderBoard {
  constructor(game){
    this.game = game;
  }

  setHandlers(){
    game.events.on("fail", async ({ game }) => {
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

    game.events.on("victory", async ({ game, score }) => {
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



console.log( new LeaderBoard(globalThis.game) );
