import React, { useState } from 'react';
import { Colors } from '../../utils/IMAGES';
import { Text, View, TouchableOpacity, Modal } from 'react-native';
import CheckBox from "@react-native-community/checkbox";

const ServicesPagination = (props) => {
    const { headings, handleCheckboxChange, endButtonHandle } = props;
    const totalPages = headings?.length;
    const [currentPage, setCurrentPage] = useState(0);

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const { tagline, options, id } = headings[currentPage];

    return (
        <View>
            {/* Modal to display options */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={true} // Modal stays open
                onRequestClose={() => {}}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headingTextStyle}>
                            {tagline}
                        </Text>

                        {options?.map((val, key) => (
                            <TouchableOpacity
                                key={key}
                                style={styles.optionContainer}
                                onPress={() => handleCheckboxChange(id, val?.value)}>
                                <CheckBox
                                    value={val?.checked}
                                    onValueChange={() => handleCheckboxChange(id, val?.value)}
                                />
                                <Text style={styles.optionText}>
                                    {val?.value}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <TouchableOpacity
                                activeOpacity={.7}
                                onPress={prevPage}
                                disabled={currentPage === 0}
                                style={[styles.nextButtonContainer, {
                                    marginRight: 6,
                                    backgroundColor: currentPage === 0 ? "gray" : Colors.Primary
                                }]}>
                                <Text style={styles.nextButtonText}>
                                    Previous
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={.7}
                                style={[{ marginLeft: 6 }, styles.nextButtonContainer]}
                                onPress={() => {
                                    if (currentPage === totalPages - 1) {
                                        endButtonHandle();
                                    } else {
                                        nextPage();
                                    }
                                }}>
                                <Text style={styles.nextButtonText}>
                                    Next
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = {
    headingTextStyle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "bold",
    },
    optionContainer: {
        marginBottom: 5,
        alignItems: "center",
        flexDirection: "row",
    },
    optionText: {
        fontSize: 16,
        color: "#333",
        marginLeft: 10,
    },
    nextButtonContainer: {
        flex: 1,
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: Colors.Primary,
    },
    nextButtonText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: 'flex-start',
    },
};

export default ServicesPagination;
