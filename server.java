import java.io.*;
import java.net.*;

class server {

    public static void main(String[] args) {

        try {

            int serverPort = 7896;
            ServerSocket listenSocket = new ServerSocket(serverPort);

            while(true) {

                Socket clientSocket = listenSocket.accept();
                Connection c = new Connection(clientSocket);

            }
            // ServerSocket ss = new ServerSocket(1201);
            // Socket s = ss.accept();

            // DataInputStream din = new DataInputStream(s.getInputStream());
            // DataOutputStream dout = new DataOutputStream(s.getOutputStream());

            // BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            // String msgin="", msgout="";

            // while(!msgin.equals("end")) {

            //     msgin = din.readUTF();
            //     System.out.println("Client:" + msgin); //printing client msg
            //     msgout = br.readLine();
            //     dout.writeUTF(msgout);
            //     dout.flush();

            // }

            // s.close();

        } catch(IOException e) {

            System.out.println("Listen:" + e.getMessage());

        }

    }

}

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
            System.out.println("Received: " + data);
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