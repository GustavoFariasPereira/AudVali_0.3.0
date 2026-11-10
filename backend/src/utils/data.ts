// utils/data.ts
export function meiaNoiteBrasil(): Date {
    const dataStr = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());

    return new Date(`${dataStr}T00:00:00.000-03:00`);
}