import './style.css';
import Experience from './Experience/Experience.ts';

const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

if (canvas instanceof HTMLCanvasElement) {
  new Experience(canvas);
} else {
  throw new Error('canvas not found');
}
