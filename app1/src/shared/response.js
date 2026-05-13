const ok = (data) => ({ ok: true, data });
const fail = (code, message, details) => ({ ok: false, err: { code, message, details } });

module.exports = { ok, fail };