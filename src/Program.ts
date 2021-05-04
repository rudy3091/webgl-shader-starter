export default class Program {
	public gl: WebGL2RenderingContext;
	public program: WebGLProgram;
	public shaders: WebGLShader[];

	constructor(gl: WebGL2RenderingContext, shaders: WebGLShader[]) {
		this.gl = gl;
		this.shaders = shaders;
		this.program = this.init()!;
	}

	init(): WebGLProgram | undefined {
		const program = this.gl.createProgram();
		if (!program) throw new Error("cannot create WebGL2 Program");

		this.shaders.forEach((shader) => this.gl.attachShader(program, shader));
		this.gl.linkProgram(program);

		const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
		if (success) return program;

		console.log(this.gl.getProgramInfoLog(program));
		this.gl.deleteProgram(program);
	}
}
