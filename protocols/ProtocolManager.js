// protocols/ProtocolManager.js

// Import protocol classes
import HTTPProxy from './HTTPProxy.js';
import SOCKS5Proxy from './SOCKS5Proxy.js';
import VLESSProxy from './VLESSProxy.js';
import AnyTLSProxy from './AnyTLSProxy.js';
import WireGuardProxy from './WireGuardProxy.js';
import SSHProxy from './SSHProxy.js';
import TUICProxy from './TUICProxy.js';
import Hysteria2Proxy from './Hysteria2Proxy.js';
import HysteriaProxy from './HysteriaProxy.js';
import TrojanProxy from './TrojanProxy.js';
import VMessProxy from './VMessProxy.js';
import SnellProxy from './SnellProxy.js';
import MieruProxy from './MieruProxy.js';
import SSRProxy from './SSRProxy.js';
import SSProxy from './SSProxy.js'; // Added: Import SSProxy class

class ProtocolManager {
    static _instance = null; // For Singleton Pattern implementation
    _protocols = {}; // Dictionary to hold protocol instances

    constructor() {
        if (ProtocolManager._instance) {
            return ProtocolManager._instance; // If an instance already exists, return it
        }
        ProtocolManager._instance = this; // Otherwise, save this instance
        this._loadProtocols(); // Load protocols on first instance creation
    }

    _loadProtocols() {
        /**
         * We manually register implemented protocols here.
         * In browser JavaScript, dynamic file scanning like in Python is not possible,
         * so new protocols must be added here.
         */
        const protocolClasses = [
            HTTPProxy,
            SOCKS5Proxy,
            VLESSProxy,
            AnyTLSProxy,
            WireGuardProxy,
            SSHProxy,
            TUICProxy,
            Hysteria2Proxy,
            HysteriaProxy,
            TrojanProxy,
            VMessProxy,
            SnellProxy,
            MieruProxy,
            SSRProxy,
            SSProxy // Added: Register SS protocol
            // Add new protocols here in the future
        ];

        for (const ProtocolClass of protocolClasses) {
            try {
                const protocolInstance = new ProtocolClass();
                this._protocols[protocolInstance.getName()] = protocolInstance;
                console.log(`Protocol '${protocolInstance.getName()}' loaded successfully.`);
            } catch (e) {
                console.error(`Error loading protocol: ${ProtocolClass.name}`, e);
            }
        }
    }

    /**
     * Returns a list of all loaded protocol instances.
     * @returns {Array<BaseProtocol>}
     */
    getAllProtocols() {
        return Object.values(this._protocols);
    }

    /**
     * Returns a protocol instance by its name.
     * @param {string} name - Protocol name (e.g., "HTTP")
     * @returns {BaseProtocol | null}
     */
    getProtocolByName(name) {
        // Protocol names are stored in uppercase in the dictionary, so convert input to uppercase too.
        return this._protocols[name.toUpperCase()] || null;
    }

    /**
     * Returns a list of names of all loaded protocols.
     * @returns {Array<string>}
     */
    getAllProtocolNames() {
        return Object.keys(this._protocols);
    }
}

// To ensure we only have one instance of ProtocolManager (Singleton)
const protocolManagerInstance = new ProtocolManager();
export default protocolManagerInstance;
