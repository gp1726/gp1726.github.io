/*
	Subtle particle background.
*/

(function() {

	var canvas = document.getElementById('background-canvas');

	if (!canvas)
		return;

	var context = canvas.getContext('2d'),
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches,
		particles = [],
		width = 0,
		height = 0,
		pixelRatio = 1,
		animationFrameId = null,
		pointer = {
			x: null,
			y: null
		};

	function resize() {

		pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
		width = window.innerWidth;
		height = window.innerHeight;

		canvas.width = Math.floor(width * pixelRatio);
		canvas.height = Math.floor(height * pixelRatio);
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

		createParticles();
		draw();

	}

	function createParticles() {

		var count = Math.min(1010, Math.max(45, Math.floor((width * height) / 15000)));

		particles = [];

		for (var i = 0; i < count; i++) {
			particles.push({
				x: Math.random() * width,
				y: Math.random() * height,
				vx: (Math.random() - 0.5) * 0.28,
				vy: (Math.random() - 1.5) * 0.58,
				radius: Math.random() * 1.6 + 1.6
			});
		}

	}

	function draw() {

		context.clearRect(0, 0, width, height);

		for (var i = 0; i < particles.length; i++) {
			var particle = particles[i];

			context.beginPath();
			context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
			context.fillStyle = 'rgba(255, 255, 255, 0.58)';
			context.fill();

			for (var j = i + 1; j < particles.length; j++) {
				var other = particles[j],
					dx = particle.x - other.x,
					dy = particle.y - other.y,
					distance = Math.sqrt(dx * dx + dy * dy),
					maxDistance = 50;

				if (distance < maxDistance) {
					context.beginPath();
					context.moveTo(particle.x, particle.y);
					context.lineTo(other.x, other.y);
					context.strokeStyle = 'rgba(126, 196, 255, ' + ((1 - distance / maxDistance) * 0.28) + ')';
					context.lineWidth = 3;
					context.stroke();
				}
			}

			if (pointer.x !== null) {
				var pointerDx = particle.x - pointer.x,
					pointerDy = particle.y - pointer.y,
					pointerDistance = Math.sqrt(pointerDx * pointerDx + pointerDy * pointerDy);

				if (pointerDistance < 170) {
					context.beginPath();
					context.moveTo(particle.x, particle.y);
					context.lineTo(pointer.x, pointer.y);
					context.strokeStyle = 'rgba(255, 255, 255, ' + ((1 - pointerDistance / 170) * 0.2) + ')';
					context.stroke();
				}
			}
		}

	}

	function update() {

		for (var i = 0; i < particles.length; i++) {
			var particle = particles[i];



			particle.x += particle.vx;
			particle.y += particle.vy;

			if (particle.x < -10)
				particle.x = width + 10;
			else if (particle.x > width + 10)
				particle.x = -10;

			if (particle.y < -10)
				particle.y = height + 10;
			else if (particle.y > height + 10)
				particle.y = -10;
		}

		draw();
		animationFrameId = window.requestAnimationFrame(update);

	}

	window.addEventListener('resize', resize);

	window.addEventListener('mousemove', function(event) {
		pointer.x = event.clientX;
		pointer.y = event.clientY;
	});

	window.addEventListener('mouseleave', function() {
		pointer.x = null;
		pointer.y = null;
	});

	resize();

	if (!reducedMotion)
		animationFrameId = window.requestAnimationFrame(update);

	window.addEventListener('beforeunload', function() {
		if (animationFrameId)
			window.cancelAnimationFrame(animationFrameId);
	});

})();
