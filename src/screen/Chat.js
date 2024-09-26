import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { Avatar } from 'react-native-paper';
import { Colors } from '../../utils/IMAGES';
import { theme } from '../constants/styles';
import Header from '../component/Header/header';
import { useNavigation } from '@react-navigation/native';

const Chat = (props) => {
  const { receiverId, receiverName } = props.route.params;
  const { access_token, user_detail } = useSelector(state => state.userReducer);
  const [isTyping, setIsTyping] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation()

  
  useEffect(() => {
    getMessagesHandle();
  }, []);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => clearTimeout(typingTimeout);
  }, [isTyping]);

  const getMessagesHandle = () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`https://arbeittech.com/api/fleet/ChatAppendApi?receiver_id=${receiverId}&user_id=${user_detail?.id}&from=USER&to=SERVICEMEN`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setMessages(result.messages || []);
        }).catch((error) => {
          console.log(error?.message);
        });
    } catch (error) {
      console.log(error?.message);
    }
  };

  const postMessageHandle = () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const userName = `${user_detail?.first_name} ${user_detail?.last_name}`;
      const formdata = new FormData();
      formdata.append("receiver_id", receiverId);
      formdata.append("sender_id", user_detail?.id);
      formdata.append("from", userName);
      formdata.append("to", receiverName);
      formdata.append("message", newMessage);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
      };

      fetch("https://arbeittech.com/api/fleet/CreateChatApi", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            // Add the new message to the state
            const updatedMessages = [
              { id: (messages.length + 1).toString(), text: newMessage, sender: 'user', seen: false },
              ...messages
            ];
            setMessages(updatedMessages);
            setNewMessage('');
          } else {
            console.log(result.message); // Log any failure message
          }
        }).catch((error) => {
          console.log(error?.message);
        });
    } catch (error) {
      console.log(error?.message);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      postMessageHandle();
      setIsTyping(true);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.adminMessage]}>
      {item.sender === 'admin' &&
        <Avatar.Image
          size={40}
          style={styles.avatar}
          source={{ uri: 'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg' }}
        />
      }
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: item.sender === 'admin' ? 'flex-start' : 'flex-end' }}>
          {item.sender === 'admin' &&
            <Text style={[styles.senderText, { color: theme.color.primaryColor }]}>
              Ibrahim
            </Text>
          }
          {item.sender === 'user' &&
            <Text style={[styles.senderText, { color: theme.color.secondaryColor }]}>
              User
            </Text>
          }
        </View>
        <Text style={[styles.messageText, { color: "black" }]}>
          {item.text}
        </Text>
      </View>
      {item.sender === 'user' &&
        <Avatar.Image
          size={40}
          style={styles.avatar}
          source={{ uri: 'https://media.istockphoto.com/id/1476170969/photo/portrait-of-young-man-ready-for-job-business-concept.webp?b=1&s=170667a&w=0&k=20&c=FycdXoKn5StpYCKJ7PdkyJo9G5wfNgmSLBWk3dI35Zw=' }}
        />
      }
    </View>
  );

  return (
   <>
   <View style={{
    marginTop:28
   }}></View>
    <Header
    title={"Chat"}
    backArrow
    backPage={() => navigation.goBack()}  
/>
    <View style={[styles.container, { backgroundColor: theme.color.white }]}>
      <FlatList
        inverted
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
      />
      {isTyping &&
        <View style={styles.typingIndicator}>
          <Text style={[styles.typingText, { color: "#0000" }]}>
            Typing...
          </Text>
        </View>
      }
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder={"Type your message here..."}
          style={[styles.input, { backgroundColor: theme.color.white, color: "black" }]}
        />
        <TouchableOpacity
          activeOpacity={.7}
          onPress={sendMessage}
          style={[styles.sendButton, { backgroundColor: theme.color.primaryColor }]}>
          <Text style={[styles.sendButtonText, { color: theme.color.white }]}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </View>
   </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  adminMessage: {
    justifyContent: 'flex-start',
  },
  senderText: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
    textAlign: "center",
  },
  messageText: {
    fontSize: 16,
    marginTop: 2,
    marginLeft: 8,
    color: "#0000",
    marginRight: 8,
    flexWrap: 'wrap',
  },
  avatar: {
    marginHorizontal: 8,
  },
  typingIndicator: {
    marginLeft: 50,
    alignItems: 'flex-start',
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  sendButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Chat;
