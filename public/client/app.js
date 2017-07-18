Vue.use(VueRouter)

const Home = {
    template: `
    <div class="user">
    <h1> Bingo Game</h1>
        <h3>Your player</h3>
         <ul class="navbar" v-for="player in players">       
                <li class="playername">{{player.name}}</li>
                <li v-for="phrase in player.card" class="cardphrase">{{phrase}}</li>
        </ul>
        <ul class="navbar player">
        <li>Name</li>
            <li><button v-on:click="gotPhrase(0)">Phrase 1</button></li>
            <li><button v-on:click="gotPhrase(1)">This is quite a long Phrase so may need wrapping</button></li>
            <li><button v-on:click="gotPhrase(2)">Phrase 3</button></li>
            <li><button v-on:click="gotPhrase(3)">Phrase 4</button></li>
            <li><button v-on:click="gotPhrase(4)">Phrase 5</button></li>
        </ul>   
        <form @submit.prevent="createPlayer" v-show="roomForMorePlayers">
        <fieldset>
            <legend>New Player</legend>
            <label>Name</label><input type="text" required v-model="playerName"> 
            <button type="Submit">Join Game</button>
        </fieldset>
        </form>

    </div>`,
    data: function () {
        return {
            playerName: '',
            playerId: 'x'
        }
    },
    computed: {
        players() {
            return store.state.players
        },
        roomForMorePlayers() {
            return store.state.players.length < 6
        },
        player() {
            return
        },
        baseURL(){
            return store.state.siteURL
        }

    },
    methods: {
        createPlayer() {
            axios.post(store.state.siteUrl +'api/users', {
                    playername: this.playerName
                })
                .then(response => {
                    store.commit('setPlayerid', response.data.id)
                    this.playerId = response.data.id
                    this.refreshPlayers()
                })
                .catch(error => {
                    console.log('There was an error: ' + error.message)
                })
        },
        gotPhrase(id) {

        },
        refreshPlayers() {
            axios.get(store.state.siteUrl + 'api/game/' + store.state.playerid)
                .then(response => {
                    store.commit('setPlayers', response.data.players)
                })
                .catch(error => {
                    console.log('There was an error: ' + error.message)
                })
        },
        PlayerRefreshLoop() {
            var self = this
            this.refreshPlayers()
            setTimeout(function () {
                self.PlayerRefreshLoop()
            }, 5000);
        }
    },
    created: function () {
        this.PlayerRefreshLoop();
    }
}

const store = new Vuex.Store({
    state: {
        players: [],
        playerid: '007',
        winner: undefined,
        gameOver: false,
        siteUrl: this.document.URL
    },
    mutations: {
        setPlayers(state, resultingplayers) {
            state.players = resultingplayers
        },
        setPlayerid(state, item) {
            state.playerid = item
        },
        setWinner(state, item) {
            state.winner = item
        },
        setGameOver(state) {
            state.gameOver = true
        }
    }
})

const router = new VueRouter({
    routes: [{
        path: '/',
        component: Home,
    }],
    mode: 'history'
})

new Vue({
    router,
    store,
    el: '#app',
    data: {
        game: []
    },
    computed: {
        players() {
            return store.state.players
        }
    },
    created() {
        console.log(store.state.siteUrl)
        axios.get(store.state.siteUrl+'api/game/007')
            .then(response => {
                store.commit('setPlayers', response.data.players)
            })
            .catch(error => {
                console.log('There was an error: ' + error.message)
            })
    }
})
