let ClassicalNoise = function(r) { // Classic Perlin noise in 3D, for comparison
	if (r === undefined) r = Math;
	this.grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];
	this.p = [];
	for (let i = 0; i < 256; i++) {
		this.p[i] = Math.floor(r.random() * 256);
	}
	// To remove the need for index wrapping, double the permutation table length
	this.perm = [];
	for (let i = 0; i < 512; i++) {
		this.perm[i] = this.p[i & 255];
	}
};

ClassicalNoise.prototype.dot = function(g, x, y, z) {
	return g[0] * x + g[1] * y + g[2] * z;
};

ClassicalNoise.prototype.mix = function(a, b, t) {
	return (1.0 - t) * a + t * b;
};

ClassicalNoise.prototype.fade = function(t) {
	return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
};

// Classic Perlin noise, 3D version
ClassicalNoise.prototype.noise = function(x, y, z) {
	// Find unit grid cell containing point
    let X = Math.floor(x);
    let Y = Math.floor(y);
    let Z = Math.floor(z);

	// Get relative xyz coordinates of point within that cell
	x = x - X;
	y = y - Y;
	z = z - Z;

	// Wrap the integer cells at 255 (smaller integer period can be introduced here)
	X = X & 255;
	Y = Y & 255;
	Z = Z & 255;

	// Calculate a set of eight hashed gradient indices
    let gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12;
    let gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12;
    let gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12;
    let gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;
    let gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12;
    let gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12;
    let gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12;
    let gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;

	// The gradients of each corner are now:
	// g000 = grad3[gi000];
	// g001 = grad3[gi001];
	// g010 = grad3[gi010];
	// g011 = grad3[gi011];
	// g100 = grad3[gi100];
	// g101 = grad3[gi101];
	// g110 = grad3[gi110];
	// g111 = grad3[gi111];
	// Calculate noise contributions from each of the eight corners
    let n000 = this.dot(this.grad3[gi000], x, y, z);
    let n100 = this.dot(this.grad3[gi100], x - 1, y, z);
    let n010 = this.dot(this.grad3[gi010], x, y - 1, z);
    let n110 = this.dot(this.grad3[gi110], x - 1, y - 1, z);
    let n001 = this.dot(this.grad3[gi001], x, y, z - 1);
    let n101 = this.dot(this.grad3[gi101], x - 1, y, z - 1);
    let n011 = this.dot(this.grad3[gi011], x, y - 1, z - 1);
    let n111 = this.dot(this.grad3[gi111], x - 1, y - 1, z - 1);
	// Compute the fade curve value for each of x, y, z
    let u = this.fade(x);
    let v = this.fade(y);
    let w = this.fade(z);
	// Interpolate along x the contributions from each of the corners
    let nx00 = this.mix(n000, n100, u);
    let nx01 = this.mix(n001, n101, u);
    let nx10 = this.mix(n010, n110, u);
    let nx11 = this.mix(n011, n111, u);
	// Interpolate the four results along y
    let nxy0 = this.mix(nx00, nx10, v);
    let nxy1 = this.mix(nx01, nx11, v);
	// Interpolate the two last results along z
    return this.mix(nxy0, nxy1, w);
};
window.addEventListener('load', () => {
    let canvas = document.getElementById('waves');

    if (canvas) {
        let ctx = canvas.getContext('2d'),
            perlin = new ClassicalNoise(),
            variation = .001,
            amp = 800,
            maxLines = 52,
            variators = [],
            canvasWidth,
            canvasHeight,
            startY;

        for (let i = 0, u = 0; i < maxLines; i++, u += .02) {
            variators[i] = u;
        }

        function draw() {
            ctx.shadowColor = 'rgba(195,204,224)';
            ctx.shadowBlur = 0;

            for (let i = 0; i <= maxLines; i++) {
                ctx.beginPath();
                ctx.moveTo(0, startY);
                let y = 0;
                for (let x = 0; x <= canvasWidth; x++) {
                    y = perlin.noise(x * variation + variators[i], x * variation, 0);
                    ctx.lineTo(x, startY + amp * y);
                }
                let alpha = Math.min(Math.abs(y), .7) + .1;
                ctx.strokeStyle = 'rgba(3,164,194,' + alpha + ')';
                ctx.stroke();
                ctx.closePath();
                variators[i] += .002;
            }
        }

        (function init() {
            resizeCanvas();
            animate();
            window.addEventListener('resize', resizeCanvas);
        })();

        function animate() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            draw();
            requestAnimationFrame(animate);
        }

        function resizeCanvas() {
            canvasWidth = document.documentElement.clientWidth;
            canvasHeight = document.documentElement.clientHeight;
            canvas.setAttribute('width', canvasWidth);
            canvas.setAttribute('height', canvasHeight);
            startY = canvasHeight / 2;
        }
    }
})
