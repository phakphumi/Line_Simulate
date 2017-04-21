package chat_bserver;

import java.io.*;
//Sasicha Poonpol 5731101921
import java.net.*;
import java.util.*;

public class Bserver_Chat extends javax.swing.JFrame {

    ArrayList<String> GroupList;
    ArrayList clientOutputStreams;
    ArrayList<String> users;
    Boolean mainStatus = true;
    int numbf = 0;

    public class ClientHandler implements Runnable {

        BufferedReader reader;
        Socket sock;
        PrintWriter client;

        public ClientHandler(Socket clientSocket, PrintWriter user) {
            client = user;
            try {
                sock = clientSocket;
                InputStreamReader isReader = new InputStreamReader(sock.getInputStream());
                reader = new BufferedReader(isReader);
            } catch (Exception ex) {
                server_chat.append("Oh my God!!! Found Error\n");
            }

        }

        @Override
        public void run() {
            String message, connect = "Connect", disconnect = "Disconnect", chat = "Chat";
            String[] data;
            try {
                while ((message = reader.readLine()) != null) {
                    if (!mainStatus) {
                        data = message.split(":");
                        server_chat.append("Received from client: " + data[0] + " " + data[1] + "\n");
                        if (data[2].equals(connect)) {
                            userAdd(data[0] + ":" + data[3]);
                            tellEveryone((data[0] + ":" + data[1] + ":" + chat + ":" + data[3]));
                        } else if (data[2].equals(disconnect)) {
                            userRemove(data[0] + ":" + data[3]);
                            tellEveryone((data[0] + ":" + data[1] + ":" + chat + ":" + data[3]));
                        } else if (data[2].equals(chat)) {
                            tellEveryone(message);

                        } else {
                            server_chat.append("essage syntax error\n");
                        }
                    } else {
                        String[] temp8 = message.split(":");
                        if (temp8[0].equalsIgnoreCase("@~Help MainServer Please")) {
                            numbf = Integer.parseInt(temp8[1]);
                            mainStatus = false;
                            Iterator it = clientOutputStreams.iterator();

                            for (int i = 0; i < numbf; i++) {
                                it.next();
                                it.remove();
                            }

                            server_chat.append("Change Main to Backup\n");
                        } else if (message.equalsIgnoreCase("G@:A")) {
                            System.out.println("add A" + " ");
                            GroupList.add("A");
                        } else if (message.equalsIgnoreCase("G@:B")) {
                            GroupList.add("B");
                            System.out.println("add B" + " ");
                        } else {
                            server_chat.append(message + "\n");
                        }
                    }
                }
            } catch (Exception ex) {
                server_chat.append("Lost a connection. \n");
                ex.printStackTrace();
                clientOutputStreams.remove(client);
            }
        }
    }

    public Bserver_Chat() {
        initComponents();
    }

    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        server_chat = new javax.swing.JTextArea();
        b_start = new javax.swing.JButton();
        b_end = new javax.swing.JButton();
        b_users = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setTitle("Tera_Bserver");
        setName("server"); // NOI18N
        setResizable(false);

        server_chat.setEditable(false);
        server_chat.setColumns(20);
        server_chat.setRows(5);
        jScrollPane1.setViewportView(server_chat);

        b_start.setText("START");
        b_start.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                b_startActionPerformed(evt);
            }
        });

        b_end.setText("SHUTDOWN");
        b_end.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                b_endActionPerformed(evt);
            }
        });

        b_users.setText("STATUS");
        b_users.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                b_usersActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 437, Short.MAX_VALUE)
                        .addContainerGap())
                    .addGroup(layout.createSequentialGroup()
                        .addGap(6, 6, 6)
                        .addComponent(b_start, javax.swing.GroupLayout.PREFERRED_SIZE, 119, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(42, 42, 42)
                        .addComponent(b_users)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(b_end)
                        .addGap(18, 18, 18))))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 319, Short.MAX_VALUE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(b_start)
                    .addComponent(b_users)
                    .addComponent(b_end))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void b_endActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_b_endActionPerformed
        try {
            Thread.sleep(1000);
            System.exit(0);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
        }

        tellEveryone("Server:is stopping and droping all clients \n:Chat");
        server_chat.append("Server is shutting down... \n");

        server_chat.setText("");
    }//GEN-LAST:event_b_endActionPerformed

    private void b_startActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_b_startActionPerformed
        Thread starter = new Thread(new ServerStart());
        starter.start();
        //Weeraphat Jungsomjatepaisal 573110221
        server_chat.append("Tera_Bserver Started\n");
        server_chat.append("Waiting for Client...\n");
    }//GEN-LAST:event_b_startActionPerformed

    private void b_usersActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_b_usersActionPerformed
        server_chat.append("\n Client Status : \n");
        for (String current_user : users) {
            String[] temp2 = current_user.split(":");
            server_chat.append(temp2[0] + " -> Group " + temp2[1] + "\n");
        }

    }//GEN-LAST:event_b_usersActionPerformed

    public static void main(String args[]) {
        java.awt.EventQueue.invokeLater(new Runnable() {
            @Override
            public void run() {
                new Bserver_Chat().setVisible(true);
            }
        });
    }

    public class ServerStart implements Runnable {

        @Override
        public void run() {
            clientOutputStreams = new ArrayList();
            users = new ArrayList();
            GroupList = new ArrayList<String>();
            try {
                ServerSocket serverSock = new ServerSocket(8888);
                while (true) {
                    Socket clientSock = serverSock.accept();
                    PrintWriter writer = new PrintWriter(clientSock.getOutputStream());
                    clientOutputStreams.add(writer);
                    Thread listener = new Thread(new ClientHandler(clientSock, writer));
                    listener.start();
                    server_chat.append("Client connect to server .\n");
                    
                }
            } catch (Exception ex) {
                server_chat.append("Error making a connection. \n");
            }
        }
    }

    public void userAdd(String data) {
        String[] group_type;
        String name = data;
        group_type = data.split(":");
        users.add(name);
        GroupList.add(group_type[1]);
        server_chat.append(group_type[0] + " has joined Group " + group_type[1] + "\n"); //Chiran Bawornkitiwong 5731018521
        String[] tempList = new String[(users.size())];
        users.toArray(tempList);
    }

    public void userRemove(String data) {

        String message, add = ": :Connect", done = "Server: :Done", name = data;
        users.remove(name);
        //Weeraphat Jungsomjatepaisal 573110221
        String[] tempList = new String[(users.size())];
        users.toArray(tempList);
        for (String token : tempList) {
            message = (token + add);
            tellEveryone(message);
        }
        tellEveryone(done);
    }

    public void tellEveryone(String message) {
        String[] temp = message.split(":");
        Iterator it = clientOutputStreams.iterator();
        Iterator itn = GroupList.iterator();
        Boolean sent = false;
        /*
        for (int i = 0; i < numbf; i++) {
            it.remove();
            it.next();
        }
         */
        for (int p = 0; p < numbf; p++) {
            try {
                if (((String) itn.next()).equalsIgnoreCase(temp[3])) {
                    PrintWriter writer = (PrintWriter) it.next();
                    writer.println(message);
                    sent = true;
                    writer.flush();
                    server_chat.setCaretPosition(server_chat.getDocument().getLength());
                } else {
                    PrintWriter writer = (PrintWriter) it.next();
                    writer.print("");
                    writer.flush();
                    server_chat.setCaretPosition(server_chat.getDocument().getLength());
                }

            } catch (Exception ex) {
                server_chat.append("Error sending message \n");
                //Pitchanai Thitipakorn 5730400321
            }
        }
        if (sent) {
            server_chat.append("Sending to Group " + temp[3] + "-> " + temp[0] + " : " + temp[1] + "\n");
            sent = false;
        }

    }


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton b_end;
    private javax.swing.JButton b_start;
    private javax.swing.JButton b_users;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTextArea server_chat;
    // End of variables declaration//GEN-END:variables
    //Terapap Apiparakoon 5730279821
}
