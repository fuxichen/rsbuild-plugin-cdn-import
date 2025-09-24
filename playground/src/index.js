import { createApp, h } from 'vue';

const App = () => {
  return h(
    'div',
    {
      class: 'content',
    },
    [
      h('h1', 'Vanilla Rsbuild'),
      h('p', 'Start building amazing things with Rsbuild.'),
    ],
  );
};

const app = createApp(App());

document.querySelector('#root').innerHTML = '<div id="app"></div>';
app.mount('#app');
