import Shader from "./Shader";
import Program from "./Program";
import vertexSource from "./shaders/vert/default.vert";
import fragmentSource from "./shaders/frag/default.frag";

export default class Renderer {
	public gl: WebGL2RenderingContext;
	public canvas: HTMLCanvasElement;
	public width = Math.pow(2, 9);
	public height = Math.pow(2, 9);

	public vertices: Float32Array;
	public d = 2;

	public vertexShader: WebGLShader;
	public fragmentShader: WebGLShader;
	public program: WebGLProgram;

	public tick: number;

	constructor(target?: HTMLElement, canvas?: HTMLCanvasElement) {
		this.canvas = canvas ?? document.createElement("canvas");
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		target === undefined
			? document.body.appendChild(this.canvas)
			: target.appendChild(this.canvas);

		const ctx = this.canvas.getContext("webgl2");
		if (!ctx) throw new Error("Cannot initialize webgl2 context");

		this.gl = ctx;
		this.vertexShader = new Shader(this.gl, "vert", vertexSource).shader;
		this.fragmentShader = new Shader(this.gl, "frag", fragmentSource).shader;
		this.program = new Program(this.gl, [
			this.vertexShader,
			this.fragmentShader,
		]).program;
		this.gl.useProgram(this.program);

		this.gl.viewport(0, 0, this.width, this.height);
		this.gl.clearColor(0, 0, 0, 0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		const positionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

		const resolutionUniformLocation = this.gl.getUniformLocation(
			this.program,
			"u_resolution"
		);
		this.gl.uniform2f(resolutionUniformLocation, this.width, this.height);

		const translationLocation = this.gl.getUniformLocation(
			this.program,
			"u_translation"
		);
		this.canvas.addEventListener("mousemove", (e) => {
			const x = e.offsetX / 512;
			const y = e.offsetY / 512;
			this.gl.uniform2fv(translationLocation, [x, y]);
		});

		// prettier-ignore
		this.vertices = new Float32Array([
			0, 0,
			0, 1,
			1, 0,
			1, 0,
			1, 1,
			0, 1,
		]);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			this.vertices,
			this.gl.STATIC_DRAW
		);

		const positionAttributeLocation = this.gl.getAttribLocation(
			this.program,
			"a_position"
		);

		const vao = this.gl.createVertexArray();
		this.gl.bindVertexArray(vao);
		this.gl.enableVertexAttribArray(positionAttributeLocation);
		// prettier-ignore
		this.gl.vertexAttribPointer(
			positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0
		);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

		this.tick = window.requestAnimationFrame(this.render);
	}

	render = (time: number) => {
		this.gl.clearColor(0, 0, 0, 0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.useProgram(this.program);

		this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / this.d);
		window.requestAnimationFrame(this.render);
	};
}
