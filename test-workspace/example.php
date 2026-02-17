<?php

class UserService
{
    public function processUser($userId)
    {
        // Load user data
        $user = $this->loadUser($userId);

        // Validate user
        if (!$this->validateUser($user)) {
            return false;
        }

        // Update user status
        $user['status'] = 'active';
        $this->saveUser($user);

        return true;
    }

    private function loadUser($userId)
    {
        // ! This is the code for extraction
        $counter = 0;

        for ($i = 0; $i < 100; $i++) {
            $counter = $i;
        }

        echo $counter;
        // ! End of code for extraction

        // Load user from database
        return ['id' => $userId, 'name' => 'John Doe'];
    }

    private function validateUser($user)
    {
        return isset($user['id']) && isset($user['name']);
    }

    private function saveUser($user)
    {
        // Save user to database
    }
}
