import { Spm } from './src/index';

const spm = new Spm({
  url: 'seed.json',
  params: {
    scene: 'test',
  },
  type: 'POST',
  ok(d) {
    console.log(d);
  },
});

spm.init();
