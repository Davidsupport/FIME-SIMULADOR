document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("refractionChart").getContext("2d");

    const medium1Select = document.getElementById("medium1");
    const medium2Select = document.getElementById("medium2");
    const angleInput = document.getElementById("angleInput");
    const reflectionAngleOutput = document.getElementById("reflectionAngle");
    const refractionAngleOutput = document.getElementById("refractionAngle");

    let chart;

    function calculateAngles() {
        const speed1 = parseFloat(medium1Select.value);
        const speed2 = parseFloat(medium2Select.value);
        const incidentAngle = parseFloat(angleInput.value);

        const incidentAngleRadians = (incidentAngle * Math.PI) / 180;
        const refractionAngleRadians = Math.asin(
            (speed2 / speed1) * Math.sin(incidentAngleRadians)
        );

        const reflectionAngle = incidentAngle; // Ángulo de reflexión es igual al de incidencia
        const refractionAngle = isNaN(refractionAngleRadians)
            ? "N/A"
            : (refractionAngleRadians * 180) / Math.PI; // Convertir a grados si es válido

        reflectionAngleOutput.textContent = `${isNaN(reflectionAngle) ? "0" : reflectionAngle.toFixed(2) + "°"}`;
        refractionAngleOutput.textContent = `${refractionAngle !== "N/A" ? refractionAngle.toFixed(2) + "°" : "0"}`;

        updateChart(incidentAngle, reflectionAngle, refractionAngle);
    }

    const updateChart = function (
        incidentAngle,
        reflectionAngle,
        refractionAngle
    ) {
        if (chart) {
            chart.destroy(); // Destruye la gráfica existente antes de crear una nueva
        }

        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Incidente", "Reflejado", "Refractado"],
                datasets: [
                    {
                        label: "Ángulos en Grados",
                        data: [
                            incidentAngle,
                            reflectionAngle,
                            refractionAngle !== "N/A" ? refractionAngle : null,
                        ],
                        backgroundColor: "rgba(0, 0, 0, 0)", // Fondo transparente
                        borderColor: [
                            "#039351", // Color para las líneas
                        ],
                        borderWidth: 2,
                        pointBackgroundColor: "#039351", // Puntos
                        pointBorderColor: "#039351",
                        fill: false,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 90,
                        grid: {
                            color: "rgba(255, 255, 255, 0.2)", // Líneas de la cuadrícula
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 1)", // Color para los números en el eje Y
                        },
                    },
                    x: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.2)", // Líneas de la cuadrícula
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 1)", // Color para los números en el eje X
                        },
                    },
                },
                plugins: {
                    legend: {
                        labels: {
                            color: "rgba(255, 255, 255, 1)", // Color para la leyenda
                        },
                    },
                },
            },
        });
    };
    medium1Select.addEventListener("change", calculateAngles);
    medium2Select.addEventListener("change", calculateAngles);
    angleInput.addEventListener("input", calculateAngles);

    calculateAngles(); // Inicializar gráfica con valores por defecto
});
