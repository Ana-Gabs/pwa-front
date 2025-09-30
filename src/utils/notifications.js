// utils/notifications.js

// Solicitar permiso al usuario
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("Tu navegador no soporta notificaciones");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

// Mostrar notificación local
export function showNotification(title, options = {}) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: options.body || "",
      icon: "/logo.png",
      ...options,
    });
  }
}
