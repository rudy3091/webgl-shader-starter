type ShaderType = "frag" | "vert";

export default class Shader {
	public gl: WebGL2RenderingContext;
	public shaderType: GLenum;
	public shader: WebGLShader;

	constructor(gl: WebGL2RenderingContext, type: ShaderType, source: string) {
		this.gl = gl;
		this.shaderType = type === "frag" ? this.gl.FRAGMENT_SHADER : this.gl.VERTEX_SHADER;

		const shader = this.gl.createShader(this.shaderType);
		if (!shader) throw new Error(`cannot compile shader "${type as string}"`);
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);
		if (!shader) throw new Error(`cannot compile shader "${type as string}"`);

		this.shader = shader;
	}
}
