<template>
  <div class="app" @click.prevent="focusAnswer()">
    <div class="deck bg-light d-flex flex-column justify-content-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-6 col-md-8 col-lg-4" style="min-width:360px;">
            <div class="card text-right">
              <div class="card-body">
                <div class="media factor">
                  <div class="media-body px-3" v-html="factor1"></div>
                </div>
                <div class="factor media">
                  <div class="media-left sign px-3 align-self-center">
                    <i class="fa fa-times"></i>
                  </div>
                  <div class="media-body px-3" v-html="factor2"></div>
                </div>
                <input id="answer" type="number"
                  :class="{ 
                    'form-control answer pr-3': true, 
                    'text-danger': correct === false, 
                    'text-success': correct === true 
                  }" v-model="answer">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="progress-wrapper">
      <b-progress :value="counter" :max="100" animated :variant="i === problems.length ? 'success' : ''"></b-progress>
    </div>
    <div class="timer-wrapper">
      <b-progress :value="countdown" :max="timeLimit" :variant="timerVariant"></b-progress>
    </div>
    <b-modal :hide-header="true" :visible="true" ok-only @hidden="start()" :button-size="'lg'">
      <h1 class="text-center">Let's practice our multiplication facts again!</h1>
      <span slot="modal-ok">Start!</span>
    </b-modal>
    <b-modal ref="done" :hide-header="true" ok-only @hidden="start()" :button-size="'lg'">
      <h1 class="text-center">Let's see how you did this time!</h1>
      <div class="my-3">
        <h2 class="text-center">
          <b>Correct:</b> {{ numCorrect }}
        </h2>
        <h2 class="text-center">
          <b>Incorrect:</b> {{ numIncorrect }}
        </h2>
      </div>
      <h2 v-if="numCorrect > numIncorrect" class="text-center">
        Yay! You did great.
      </h2>
      <h3 v-if="numCorrect <= numIncorrect" class="text-center">
        Hey&mdash;you'll do better next time. Practice makes perfect.
      </h3>
      <span slot="modal-ok">Play Again</span>
    </b-modal>
  </div>
</template>

<script>
import $ from 'jquery'
import BootstrapVue from 'bootstrap-vue'
import Vue from 'vue'
import { range } from 'lodash'
import audio from 'browser-audio'

Vue.use(BootstrapVue)

export default {
  name: 'full',
  data () {
    return {
      i: -1,
      numCorrect: 0,
      numIncorrect: 0,
      numProblems: 20,
      paused: true,
      started: null,
      problems: [],
      factor1: '&nbsp;',
      factor2: '&nbsp;',
      counter: 0,
      countdown: 0,
      timeLimit: 20, // num of seconds to answer the question
      timerVariant: 'primary',
      answer: null,
      correctSound: audio.create('dist/audio/smw_1-up.mp3'),
      incorrectSound: audio.create('dist/audio/smw_riding_yoshi.mp3'),
      winSound: audio.create('dist/audio/smw_power-up.mp3'),
      correct: null
    }
  },
  watch: {
    i () {
      this.started = this.now()

      if (this.i <= this.problems.length - 1) {
        this.correct = null
        this.answer = null
        this.factor1 = this.problems[this.i].factor1
        this.factor2 = this.problems[this.i].factor2
        $('#answer').focus()
      } else {
        this.paused = true
        this.$refs.done.show()
        this.winSound.play()
      }

      if (this.i > 0 && this.problems.length > 1) {
        this.counter = this.i / this.problems.length * 100
      } else {
        this.counter = 0
      }
    },
    answer () {
      if (this.correct !== false && this.answer) {
        this.correct = null
        if (parseInt(this.answer) === parseInt(this.factor1) * parseInt(this.factor2)) {
          this.numCorrect++
          this.countdown = this.timeLimit
          this.correct = true
          this.correctSound.play()
          setTimeout(() => {
            this.i++
          }, 1000)
        }
      }
    },
    countdown () {
      if (this.countdown) {
        if (this.countdown / this.timeLimit <= 0.20) {
          this.timerVariant = 'danger'
        } else if (this.countdown / this.timeLimit <= 0.50) {
          this.timerVariant = 'warning'
        } else {
          this.timerVariant = 'primary'
        }
      } else {
        this.correct = false
        this.numIncorrect++
        this.answer = parseInt(this.factor1) * parseInt(this.factor2)
        this.incorrectSound.play()
        setTimeout(() => {
          this.i++
        }, 3000)
      }
    }
  },
  mounted () {
    //
  },
  methods: {
    start () {
      // initialize problem set
      for (let i of range(0, this.numProblems)) {
        this.problems[i] = {
          factor1: this.rand(),
          factor2: this.rand()
        }
      }

      this.paused = false
      this.numCorrect = 0
      this.numIncorrect = 0
      this.countdown = this.timeLimit
      this.i = -1
      this.i++

      this.focusAnswer()

      setInterval(() => {
        if (!this.paused && this.correct === null) {
          this.countdown = this.timeLimit - (this.now() - this.started)
        }
      }, 1000)
    },
    now () {
      return Math.round(new Date().getTime() / 1000)
    },
    focusAnswer () {
      $('#answer').focus()
    },
    rand () {
      return Math.round(Math.random() * 11) + 1
    }
  }
}
</script>