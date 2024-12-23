document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("refractionChart").getContext("2d");

    const medium1Select = document.getElementById("medium1");
    const medium2Select = document.getElementById("medium2");
    const angleInput = document.getElementById("angleInput");
    const reflectionAngleOutput = document.getElementById("reflectionAngle");
    const refractionAngleOutput = document.getElementById("refractionAngle");
    const medio1Output = document.getElementById("medio1");
    const medio2Output = document.getElementById("medio2");

    let chart;

    function calculateAngles() {
        const speed1 = parseFloat(medium1Select.value);
        const speed2 = parseFloat(medium2Select.value);
        const incidentAngle = parseFloat(angleInput.value);

        const criticalAngle = (Math.asin(speed2 / speed1) * 180) / Math.PI;

        const incidentAngleRadians = (incidentAngle * Math.PI) / 180;
        const refractionAngleRadians = Math.asin(
            (speed2 / speed1) * Math.sin(incidentAngleRadians)
        );

        let reflectance = 0;
        let transmittance = 0;

        const hasTotalInternalReflection =
            speed1 > speed2 && incidentAngle > criticalAngle;

        if (!hasTotalInternalReflection && !isNaN(refractionAngleRadians)) {
            const rs = Math.pow(
                (speed1 * Math.cos(incidentAngleRadians) -
                    speed2 * Math.cos(refractionAngleRadians)) /
                    (speed1 * Math.cos(incidentAngleRadians) +
                        speed2 * Math.cos(refractionAngleRadians)),
                2
            );
            const rp = Math.pow(
                (speed2 * Math.cos(incidentAngleRadians) -
                    speed1 * Math.cos(refractionAngleRadians)) /
                    (speed2 * Math.cos(incidentAngleRadians) +
                        speed1 * Math.cos(refractionAngleRadians)),
                2
            );

            reflectance = (rs + rp) / 2;
            transmittance = 1 - reflectance;
        } else {
            reflectance = 1;
            transmittance = 0;
        }

        const reflectionAngle = incidentAngle; // Reflexión igual al ángulo de incidencia
        const refractionAngle =
            isNaN(refractionAngleRadians) ||
            Math.abs((speed2 / speed1) * Math.sin(incidentAngleRadians)) > 1
                ? "N/A"
                : (refractionAngleRadians * 180) / Math.PI;

        reflectionAngleOutput.textContent = `${reflectionAngle.toFixed(
            2
        )}° (R: ${(reflectance * 100).toFixed(1)}%)`;
        refractionAngleOutput.textContent =
            refractionAngle !== "N/A"
                ? `${refractionAngle.toFixed(2)}° (T: ${(
                      transmittance * 100
                  ).toFixed(1)}%)`
                : "Reflexión Total Interna";
        medio1Output.textContent = `${speed1}`;
        medio2Output.textContent = `${speed2}`;

        updateChart(
            incidentAngle,
            reflectionAngle,
            refractionAngle,
            reflectance,
            transmittance
        );
    }

    function updateChart(
        incidentAngle,
        reflectionAngle,
        refractionAngle,
        reflectance,
        transmittance
    ) {
        if (chart) {
            chart.destroy();
        }

        const datasets = [];

        // Rayo de incidencia
        datasets.push({
            label: "Rayo de incidencia",
            data: [
                { x: 0, y: 0 },
                {
                    x: -Math.sin((incidentAngle * Math.PI) / 180), // Cambiado a negativo para el cuadrante II
                    y: Math.cos((incidentAngle * Math.PI) / 180),
                },
            ],
            borderColor: "#ff0000",
            showLine: true, 
            borderWidth: 2,
        });

        // Normal
        datasets.push({
            label: "Normal",
            data: [
                { x: 0, y: -1 },
                { x: 0, y: 1 },
            ],
            borderColor: "#8a8a8a",
            borderDash: [5, 5],
            showLine: true,
            borderWidth: 1,
        });

        // Interfaz de medios
        datasets.push({
            label: "Interfaz de medios",
            data: [
                { x: -1, y: 0 },
                { x: 1, y: 0 },
            ],
            borderColor: "#000000",
            borderDash: [5, 5],
            showLine: true,
            borderWidth: 1,
        });

        // Rayo refractado
        if (refractionAngle !== "N/A") {
            datasets.push({
                label: "Rayo refractado",
                data: [
                    { x: 0, y: 0 },
                    {
                        x: Math.sin((refractionAngle * Math.PI) / 180), // Cambiado a positivo para el cuadrante IV
                        y: -Math.cos((refractionAngle * Math.PI) / 180), // Cambiado a negativo para el cuadrante IV
                    },
                ],
                borderColor: `rgba(0, 0, 255, ${transmittance})`,
                showLine: true,
                borderWidth: 2,
            });
        }

        chart = new Chart(ctx, {
            type: "scatter",
            data: {
                datasets: datasets,
            },
            options: {
                scales: {
                    x: {
                        type: "linear",
                        position: "bottom",
                        min: -1,
                        max: 1,
                        grid: {
                            color: "rgba(200, 200, 200, 0.3)",
                        },
                        title: {
                            display: true,
                            text: "Eje (X)",
                        },
                    },
                    y: {
                        type: "linear",
                        min: -1,
                        max: 1,
                        grid: {
                            color: "rgba(200, 200, 200, 0.3)",
                        },
                        title: {
                            display: true,
                            text: "Eje (Y)",
                        },
                    },
                },
                plugins: {
                    legend: {
                        labels: {
                            color: "rgba(255, 255, 255, 1)",
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const dataset = context.dataset;
                                if (dataset.label === "Rayo reflejado") {
                                    return `${dataset.label} (R: ${(
                                        reflectance * 100
                                    ).toFixed(1)}%)`;
                                } else if (
                                    dataset.label === "Rayo refractado"
                                ) {
                                    return `${dataset.label} (T: ${(
                                        transmittance * 100
                                    ).toFixed(1)}%)`;
                                }
                                return dataset.label;
                            },
                        },
                    },
                },
            },
        });
    }

    medium1Select.addEventListener("change", calculateAngles);
    medium2Select.addEventListener("change", calculateAngles);
    angleInput.addEventListener("input", calculateAngles);

    calculateAngles();
});
