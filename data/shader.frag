#ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_COLOR_SHADER

uniform vec2 u_resolution;
uniform float u_time;
float dist(vec3 ray){
    float d1 = length(vec3(sin(u_time)*2, cos(u_time)*2, 0.)-ray)-1.;
    float d2 = length(vec3(cos(u_time), 0., sin(u_time))-ray)-1.;
    return min(d1, d2);
}
float sdPlane(vec3 p, vec3 n, float h )
{
  // n must be normalized
  return dot(p,n) + h;
}


vec3 shoot(vec3 start, vec3 dir, float traveled){
    vec3 ray = start;
    for (int i = 0; i<50; i++){
        ray = start + dir * traveled;
        float pl = sdPlane(ray, normalize(vec3(0., 1.6, 0.)), 1.);
        float d = dist(ray);
        d = min(d, pl);
        if (d < 0.01) break;
        if (d > 30) break;
        traveled += d;
    }
    return ray;
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution;
    uv -= 0.5;
    uv *= 2.;
    uv.x *= u_resolution.x/u_resolution.y;
    vec3 camera = vec3(0., 0., -3.);
    vec3 sun = vec3(0.5, 2.5, -1.);
    vec3 dir = normalize(vec3(uv, 1.));
    vec3 point = shoot(camera, dir, 0.);
    vec3 color = vec3(0., 0., 0.);
    if (dist(point) < 0.01){
        color = vec3(1.-length(point-camera)/5., 0., 0.);
    } else {
        color = vec3(length(point-camera)/10);
    }

    vec3 isShadow = shoot(point, normalize(sun-point), 0.03);
    if (dist(isShadow) < 0.02){
        color *= 0.6;
    } else {
        color *= 1.4;
    }

    gl_FragColor = vec4(color, 1.);
}