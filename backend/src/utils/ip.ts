import { Request } from "express";

export function obterIpReal(req: Request): string {
    // 1. Tenta pegar do header X-Forwarded-For (comum em proxies e cloud)
    const xForwardedFor = req.headers["x-forwarded-for"];
    
    if (typeof xForwardedFor === "string") {
        // Se houver vários IPs separados por vírgula, o primeiro costuma ser o do cliente real
        return xForwardedFor.split(",")[0].trim();
    }
    
    // 2. Se não houver proxy, pega o req.ip nativo do Express (respeitando o trust proxy)
    if (req.ip) {
        return req.ip;
    }

    // 3. Fallback final para o socket remoto ou localhost
    const remoteAddress = req.socket.remoteAddress;
    if (remoteAddress) {
        // Remove o prefixo IPv6 de loopback se necessário (ex: ::ffff:127.0.0.1 -> 127.0.0.1)
        return remoteAddress.replace(/^.*:/, '') === '1' ? '127.0.0.1' : remoteAddress;
    }

    return "IP_DESCONHECIDO";
}