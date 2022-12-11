<?php

// $firstName = $_GET['fname'];
// $lastName = $_GET['lname'];
// $phone = $_GET['phn'];
$action = $_GET['act'];
isset($_GET['id']) ? $id = $_GET['id'] : $id = null;

class PhoneBook {

    private $firstName;
    private $lastName;
    private $phone;
    private $PATH;
    private static ?PhoneBook $instance = null;

    private function __construct($fname, $lname, $phone) {
        $this->firstName = $fname;
        $this->lastName = $lname;
        $this->phone = $phone;
        $this->PATH = "..\data\\" . strtolower($this->firstName[0]) . ".json";
    }

    public static function getInstance() {
        if (self::$instance === null) {
        self::$instance = new self($_GET['fname'], $_GET['lname'], $_GET['phn']/*, $id*/);
        }

        return self::$instance;
    }

    public function changeFile() {
        $data = [];
        $file = json_decode(file_get_contents($this->PATH), true);

        for($i=0;$i<count($file);$i++) {
            if($file[$i]['id'] == $_GET['id']) {
                $file[$i]['firstname'] = $this->firstName;
                $file[$i]['lastname'] = $this->lastName;
                $file[$i]['phone'] = $this->phone;
            }
            array_push($data, $file[$i]);
        }
        $final=json_encode($file);
        file_put_contents($this->PATH ,$final);
    }

    public function generateData($id) {
        $data = ["id"=> ++$id, "firstname"=> $this->firstName, "lastname"=> $this->lastName, "phone"=> $this->phone];
        return $data;
    }

    public function saveFile() {
        if(file_exists($this->PATH)) {
            $file = json_decode(file_get_contents($this->PATH), true);
            $end_element = end($file);
            $end_element_id = $end_element['id'];
        } else {
            $file = [];
            $end_element_id = 0;
        }
        $data = $this->generateData($end_element_id);
        array_push($file, $data);
        $file=json_encode($file);
        file_put_contents($this->PATH ,$file);
    }
}


$phonebook = PhoneBook::getInstance();

if($action == "new") {
    $phonebook->saveFile();
}

if($action == "edit") {
    $phonebook->changeFile();
}