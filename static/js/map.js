let map;
let redIcon;
let greenIcon;
let currentMarker = null;
let isMarkerSaved = false;
let firstClickAfterSave = false;
let savedMarkers = [];

document.addEventListener('DOMContentLoaded', () => {
    map = L.map('map').setView([59.9343, 30.3351], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    greenIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    L.control.scale().addTo(map);
    map.on('click', addMarker);

    loadMarkers();
});

function updateInfoContent(markerData) {
    const infoContent = document.getElementById('info-content');
    infoContent.innerHTML = `
        <h2>Детали метки</h2>
        <p><strong>Широта:</strong> ${markerData.latitude}</p>
        <p><strong>Долгота:</strong> ${markerData.longitude}</p>
        <p><strong>Комментарий:</strong> ${markerData.comment}</p>
    `;
}

async function saveComment(lat, lng) {
    const comment = document.getElementById('comment').value;

    try {
        const response = await fetch('/markers/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude: lat,
                longitude: lng,
                comment: comment
            }),
        });

        if (response.ok) {
            console.log('Маркер сохранен');
            isMarkerSaved = true;
            firstClickAfterSave = true;

            if (currentMarker) {
                currentMarker.setIcon(greenIcon);
                currentMarker.unbindPopup();
                currentMarker.bindPopup(comment);
                updateInfoContent({
                    latitude: lat,
                    longitude: lng,
                    comment: comment
                });
                currentMarker.closePopup();

                currentMarker.dragging.disable();
            }

            savedMarkers.push(currentMarker);
            currentMarker = null;
        }
    } catch (error) {
        console.error('Ошибка при сохранении:', error);
    }
}

function addMarker(e) {
    if (firstClickAfterSave) {
        firstClickAfterSave = false;
        return;
    }

    if (currentMarker && !isMarkerSaved) {
        map.removeLayer(currentMarker);
    }

    currentMarker = L.marker(e.latlng, {
        icon: redIcon,
        draggable: true
    }).addTo(map);

    const popupContent = `
        <div>
            <textarea id="comment" rows="3" cols="20"></textarea>
            <br>
            <button onclick="saveComment(${e.latlng.lat}, ${e.latlng.lng})">
                Сохранить
            </button>
        </div>
    `;

    currentMarker.bindPopup(popupContent).openPopup();

    currentMarker.on('dragend', function(event) {
        const position = currentMarker.getLatLng();
        console.log('Новая позиция:', position);
    });

    currentMarker.on('popupclose', function() {
        if (!isMarkerSaved) {
            map.removeLayer(currentMarker);
            currentMarker = null;
        }
    });

    isMarkerSaved = false;
}

async function loadMarkers() {
    try {
        const response = await fetch('/markers/');
        const markers = await response.json();

        markers.forEach(markerData => {
            const marker = L.marker([markerData.latitude, markerData.longitude], {
                icon: greenIcon,
                draggable: false
            }).addTo(map);

            marker.bindPopup(markerData.comment);

            marker.on('click', function() {
                updateInfoContent(markerData);
            });

            savedMarkers.push(marker);
        });
    } catch (error) {
        console.error('Ошибка при загрузке маркеров:', error);
    }
}
