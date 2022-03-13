class MainElement {

}


class LeaderBoard {
  constructor(game){
    this.game = game;
    this.#setHandlers();
  }

  #setHandlers(){
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

      fetch(`https://stats-co.zoodogood.repl.co/let-s-bet/score/EQUAL_${ score }?method=increment`, options)
        .catch(err => console.log(err));
    })
  }
}

new LeaderBoard( globalThis.game );
