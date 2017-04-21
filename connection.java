class Connection extends Thread {

    DataInputStream in;
    DataOutputStream out;
    Socket clientSocket;

    public Connection(Socket aClientSocket) {

        try {

            clientSocket = aClientSocket;
            in = new DataInputStream(clientSocket.getInputStream());
            out = new DataOutputStream(clientSocket.getOutputStream());
            this.start();

        } catch(IOException e) {

            System.out.println("Connection:" + e.getMessage());

        }

    }

    public void run() {

        try {

            String data = in.readUTF(); //read client message
            out.writeUTF(data); //sending data

        } catch(EOFException e) {

            System.out.println("EOF:" + e.getMessage());

        } catch(IOException e) {

            System.out.println("IO:" + e.getMessage());

        } finally {

            try {

                clientSocket.close();

            } catch(IOException e) {



            }

        }

    }

}