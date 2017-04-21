import java.io.*;
import java.net.*;

class client {

    public static void main(String[] args) {

        Socket s = null;
        
        try {

            int serverPort = 7896;
            s = new Socket(args[1], serverPort);
            DataInputStream in = new DataInputStream(s.getInputStream());
            DataOutputStream out = new DataOutputStream(s.getOutputStream());
            out.writeUTF(args[0]); // UTF is a string encoding
            String data = in.readUTF();
            System.out.println("Received: " + data);

            // Socket s = new Socket("127.0.0.1", 7896);
            // DataInputStream din = new DataInputStream(s.getInputStream());
            // DataOutputStream dout = new DataOutputStream(s.getOutputStream());

            // BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            // String msgin="", msgout="";

            // while(!msgin.equals("end")) {
            //     // msgin = din.readUTF();
            //     // System.out.println(msgin);
            //     msgout = br.readLine();
            //     dout.writeUTF(msgout);
            //     msgin = din.readUTF();
            //     System.out.println("Server:" + msgin); //printing server msg.

            // }

            // s.close();

        } catch(UnknownHostException e) { 
            System.out.println("Sock:"+e.getMessage());
        } catch(EOFException e) {
            
            System.out.println("EOF:"+e.getMessage());

        } catch(IOException e) {
                
            System.out.println("IO:"+e.getMessage());
        
        } finally { 
        
            if(s!=null) {
                try {
            
                    s.close();
            
                } catch(IOException e) {
                
                    System.out.println("close:"+e.getMessage());
                
                }
            
            } 
            
        }

    }

}