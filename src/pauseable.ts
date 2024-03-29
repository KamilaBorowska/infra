
import Server from './server';
import net from 'net';

export default class Pauseable extends Server {
    private buffer : net.Socket[] | null;
    private server : Server;

    constructor(server : Server) {
        super();
        this.buffer = null;
        this.server = server;
    }

    accept(s : net.Socket) {
        if (this.buffer !== null) {
            this.buffer.push(s);
        } else {
            this.server.accept(s);
        }
    }

    running() {
        return this.buffer === null;
    }

    pause() {
        if (this.buffer === null) {
            this.buffer = [];
        }
    }

    resume() {
        if (this.buffer !== null) {
            for (let s of this.buffer) {
                this.server.accept(s);
            }
            this.buffer = null;
        }
    }
}
