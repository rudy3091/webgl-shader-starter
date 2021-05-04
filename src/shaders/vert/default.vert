#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;

void main() {
	vec2 position = a_position + u_translation + vec2(-1, -1);

	gl_Position = vec4(position * vec2(1, -1), 0, 1);
}
