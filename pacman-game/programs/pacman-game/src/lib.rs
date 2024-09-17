use anchor_lang::prelude::*;

declare_id!("DRUiH1Vd6zUvrZXKmKPwKnYq8jLiUYJdffStA1ETmc2v");

#[program]
pub mod pacman_game {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn play_game(ctx: Context<PlayGame>) -> Result<()> {
        // Game logic or state updates can go here
        msg!("User has played the game!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct PlayGame<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
}