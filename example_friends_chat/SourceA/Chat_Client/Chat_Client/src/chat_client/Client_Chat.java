package chat_client;

import java.net.*;
//Sasicha Poonpol 5731101921
import java.io.*;
import java.util.*;

public class Client_Chat extends javax.swing.JFrame {

    String unread = "";
    String Client_ID, address = "localhost";
    String Client_Group = "A";
    Boolean Mute = false;
    ArrayList<String> users = new ArrayList();
    int port = 6969;
    Boolean isConnected = false;
    //Chiran Bawornkitiwong 5731018521
    Socket sock;
    BufferedReader reader;
    PrintWriter writer;

    //--------------------------//
    public void ListenThread() {
        Thread IncomingReader = new Thread(new IncomingReader());
        IncomingReader.start();
    }

    //--------------------------//
    public String userAdd(String data) {
        users.add(data);
        return data;
    }

    //--------------------------//
    public String userRemove(String data) {
        client_chat.append(data + " is now offline.\n");
        return (data + " is now offline.\n");
    }

    //--------------------------//
    public void writeUsers() {
        String[] tempList = new String[(users.size())];
        users.toArray(tempList);
    }

    //--------------------------//
    public void sendDisconnect() {
        String bye = (Client_ID + ": :Disconnect");
        try {
            writer.println(bye);
            writer.flush();
        } catch (Exception e) {
            client_chat.append("Could not send Disconnect message.\n");
        }
    }

    //--------------------------//
    public void Disconnect() {
        try {
            client_chat.append("Disconnected.\n");
            sock.close();
        } catch (Exception ex) {
            client_chat.append("Failed to disconnect. \n");
        }
        isConnected = false;
        tf_username.setEditable(true);

    }

    public Client_Chat() {
        initComponents();
    }

    //--------------------------//
    public class IncomingReader implements Runnable {

        @Override
        public void run() {
            String[] data;
            String stream, done = "Done", connect = "Connect", disconnect = "Disconnect", chat = "Chat", change = "Change";

            try {
                while ((stream = reader.readLine()) != null) {
                    data = stream.split(":");
                    if (Mute != true) {
                        if (data[2].equals(chat)) {
                            client_chat.append(data[0] + " : " + data[1] + "\n");
                            client_chat.setCaretPosition(client_chat.getDocument().getLength());
                        } else if (data[2].equals(connect)) {
                            client_chat.removeAll();
                            userAdd(data[0]);

                        } else if (data[2].equals(change)) {
                            setBport();
                        } else if (data[2].equals(disconnect)) {
                            userRemove(data[0]);
                        } else if (data[2].equals(done)) {
                            writeUsers();
                            users.clear();
                        }
                    } else if (Mute == true) {
                        if (data[2].equals(chat)) {
                            unread += data[0] + " : " + data[1] + "\n";
                        } else if (data[2].equals(connect)) {
                            unread += userAdd(data[0]);
                        } else if (data[2].equals(change)) {
                            setBport();

                        } else if (data[2].equals(disconnect)) {
                            unread += userRemove(data[0]);
                        } else if (data[2].equals(done)) {
                            writeUsers();
                            users.clear();
                        }
                    }
                }
            } catch (Exception ex) {
            }
        }
    }

    //--------------------------//
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        lb_username = new javax.swing.JLabel();
        tf_username = new javax.swing.JTextField();
        b_connect = new javax.swing.JButton();
        b_disconnect = new javax.swing.JButton();
        jScrollPane1 = new javax.swing.JScrollPane();
        client_chat = new javax.swing.JTextArea();
        tf_chat = new javax.swing.JTextField();
        b_send = new javax.swing.JButton();
        jButton1 = new javax.swing.JButton();
        jComboBox1 = new javax.swing.JComboBox<>();
        jButton2 = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setTitle("Client _Chat ");
        setName("client"); // NOI18N
        setResizable(false);

        lb_username.setText("ID :");

        tf_username.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                tf_usernameActionPerformed(evt);
            }
        });

        b_connect.setText("Join group");
        b_connect.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                b_connectActionPerformed(evt);
            }
        });

        b_disconnect.setText("Leave group");
        b_disconnect.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                b_disconnectActionPerformed(evt);
            }
        });

        client_chat.setEditable(false);
        client_chat.setColumns(20);
        client_chat.setRows(5);
        jScrollPane1.setViewportView(client_chat);

        b_send.setIcon(new javax.swing.ImageIcon(getClass().getResource("/Img/Send.png"))); // NOI18N
        b_send.setText("SEND");
        b_send.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                b_sendActionPerformed(evt);
            }
        });

        jButton1.setText("Exit chat");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        jComboBox1.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Group A", "Group B" }));
        jComboBox1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jComboBox1ActionPerformed(evt);
            }
        });

        jButton2.setText("Get unread ");
        jButton2.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton2ActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGap(12, 12, 12)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.PREFERRED_SIZE, 407, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(jComboBox1, javax.swing.GroupLayout.PREFERRED_SIZE, 125, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(layout.createSequentialGroup()
                                .addComponent(lb_username, javax.swing.GroupLayout.PREFERRED_SIZE, 23, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(tf_username, javax.swing.GroupLayout.PREFERRED_SIZE, 125, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 109, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(b_connect))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jButton2)
                            .addComponent(b_disconnect, javax.swing.GroupLayout.PREFERRED_SIZE, 116, javax.swing.GroupLayout.PREFERRED_SIZE)))
                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, layout.createSequentialGroup()
                        .addComponent(tf_chat, javax.swing.GroupLayout.PREFERRED_SIZE, 343, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(b_send, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addGap(14, 14, 14)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(lb_username)
                    .addComponent(tf_username, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(b_connect)
                    .addComponent(b_disconnect))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jComboBox1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jButton1)
                    .addComponent(jButton2))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 285, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(b_send, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(tf_chat, javax.swing.GroupLayout.PREFERRED_SIZE, 45, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void tf_usernameActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_tf_usernameActionPerformed

    }//GEN-LAST:event_tf_usernameActionPerformed

    private void b_connectActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_b_connectActionPerformed
        if (isConnected == false) {
            Client_ID = tf_username.getText();
            tf_username.setEditable(false);

            try {
                sock = new Socket(address, port);
                InputStreamReader streamreader = new InputStreamReader(sock.getInputStream());
                reader = new BufferedReader(streamreader);
                writer = new PrintWriter(sock.getOutputStream());
                writer.println(Client_ID + ":has connected.:Connect:" + Client_Group);
                writer.flush();
                isConnected = true;
            } catch (Exception ex) {
                client_chat.append("Cannot Connect! Try Again. \n");
                tf_username.setEditable(true);
            }

            ListenThread();

        } else if (isConnected == true) {
            client_chat.append("You are already connected. \n");
        }
    }//GEN-LAST:event_b_connectActionPerformed

    private void b_disconnectActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_b_disconnectActionPerformed
        sendDisconnect();
        Disconnect();
    }//GEN-LAST:event_b_disconnectActionPerformed

    private void b_sendActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_b_sendActionPerformed
        String nothing = "";
        if ((tf_chat.getText()).equals(nothing)) {
            tf_chat.setText("");
            tf_chat.requestFocus();
        } else {
            try {
                writer.println(Client_ID + ":" + tf_chat.getText() + ":" + "Chat" + ":" + Client_Group);
                writer.flush();
            } catch (Exception ex) {
                client_chat.append("Message was not sent. \n");
                //Pitchanai Thitipakorn 5730400321
            }
            tf_chat.setText("");
            tf_chat.requestFocus();
        }

        tf_chat.setText("");
        tf_chat.requestFocus();
    }//GEN-LAST:event_b_sendActionPerformed

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed

        if (Mute == false) {
            Mute = true;
            jButton1.setText("Resume");
        } else if (Mute == true) {
            Mute = false;
            jButton1.setText("Exit chat");
        }
    }//GEN-LAST:event_jButton1ActionPerformed

    private void jComboBox1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jComboBox1ActionPerformed

        if (jComboBox1.getSelectedItem().toString() == "Group A") {
            Client_Group = "A";
        } else if (jComboBox1.getSelectedItem().toString() == "Group B") {
            Client_Group = "B";
        }
    }//GEN-LAST:event_jComboBox1ActionPerformed

    private void jButton2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton2ActionPerformed

        if (!Mute) {
            client_chat.append(unread);
            unread = "";
        } else {
            client_chat.append("Please resume to chat room before get the message\n");
        }

    }//GEN-LAST:event_jButton2ActionPerformed

    public static void main(String args[]) {
        java.awt.EventQueue.invokeLater(new Runnable() {
            @Override
            public void run() {
                new Client_Chat().setVisible(true);
            }
        });
    }

    public void setBport() {
        try {
            sock.close();
            sock = new Socket(address, 8888);
            InputStreamReader streamreader = new InputStreamReader(sock.getInputStream());
            reader = new BufferedReader(streamreader);
            writer = new PrintWriter(sock.getOutputStream());
            client_chat.append("Main-Server was shutdown redirect to Backup-Server Success\n");
        } catch (Exception ex) {
            client_chat.append("Cannot Connect! Try Again. \n");
            tf_username.setEditable(true);
        }

    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton b_connect;
    private javax.swing.JButton b_disconnect;
    private javax.swing.JButton b_send;
    private javax.swing.JTextArea client_chat;
    private javax.swing.JButton jButton1;
    private javax.swing.JButton jButton2;
    private javax.swing.JComboBox<String> jComboBox1;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JLabel lb_username;
    private javax.swing.JTextField tf_chat;
    private javax.swing.JTextField tf_username;
    // End of variables declaration//GEN-END:variables
    //Terapap Apiparakoon 5730279821
}
